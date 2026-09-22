import fs from "node:fs";
import { buildNowAnswer, buildTodayAnswer } from "../src/scheduleLogic.js";
import { demoGroups, demoSchedule } from "../src/demoData.js";

function loadEnv() {
  if (!fs.existsSync(".env")) {
    return;
  }

  const rows = fs.readFileSync(".env", "utf8").split(/\r?\n/);

  for (const row of rows) {
    const trimmed = row.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key.trim()] ??= valueParts.join("=").trim();
  }
}

loadEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const selectedGroups = new Map();
let lastUpdateId = 0;

if (!token) {
  console.error("Добавьте TELEGRAM_BOT_TOKEN в .env перед запуском бота.");
  process.exit(1);
}

async function telegram(method, payload = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.description || `Telegram ${method} failed`);
  }

  return result.result;
}

async function supabaseGet(table, searchParams = new URLSearchParams()) {
  const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`);
  url.search = searchParams.toString();

  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase вернул ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function loadGroups() {
  if (!hasSupabaseConfig) {
    return demoGroups;
  }

  return supabaseGet("groups", new URLSearchParams({
    select: "id,name",
    order: "name.asc"
  }));
}

async function loadSchedule(groupId) {
  if (!hasSupabaseConfig) {
    return demoSchedule.filter((lesson) => Number(lesson.group_id) === Number(groupId));
  }

  return supabaseGet("schedule", new URLSearchParams({
    select: "id,group_id,day_of_week,lesson_number,subject_name,time_start,time_end",
    group_id: `eq.${groupId}`,
    order: "day_of_week.asc,lesson_number.asc"
  }));
}

async function sendGroupPicker(chatId) {
  const groups = await loadGroups();
  
  // Визуальное отличие: делаем кнопки по 2 в ряд
  const keyboard = [];
  for (let i = 0; i < groups.length; i += 2) {
    const row = [];
    row.push({ text: `🎓 ${groups[i].name}`, callback_data: `group:${groups[i].id}:${groups[i].name}` });
    if (groups[i + 1]) {
      row.push({ text: `🎓 ${groups[i + 1].name}`, callback_data: `group:${groups[i + 1].id}:${groups[i + 1].name}` });
    }
    keyboard.push(row);
  }

  await telegram("sendMessage", {
    chat_id: chatId,
    // Визуальное отличие: новый текст приветствия
    text: "👋 Привет! Давай найдем твое расписание. Выбери свою группу из списка ниже:",
    reply_markup: { inline_keyboard: keyboard }
  });
}

async function answerCommand(chatId, command) {
  const group = selectedGroups.get(chatId);

  if (!group) {
    await telegram("sendMessage", {
      chat_id: chatId,
      // Визуальное отличие: измененный текст ошибки
      text: "⚠️ Ой, я пока не знаю твою группу. Нажми /start, чтобы выбрать её!"
    });
    await sendGroupPicker(chatId);
    return;
  }

  const lessons = await loadSchedule(group.id);
  const answer = command === "/now"
    ? buildNowAnswer(lessons, group.name)
    : buildTodayAnswer(lessons, group.name);

  await telegram("sendMessage", {
    chat_id: chatId,
    text: answer
  });
}

async function handleCallback(query) {
  const [kind, id, ...nameParts] = query.data.split(":");

  if (kind !== "group") {
    return;
  }

  const group = { id: Number(id), name: nameParts.join(":") };
  selectedGroups.set(query.message.chat.id, group);

  await telegram("answerCallbackQuery", { callback_query_id: query.id });
  await telegram("sendMessage", {
    chat_id: query.message.chat.id,
    // Визуальное отличие: измененный текст подтверждения
    text: `✅ Супер! Группа ${group.name} сохранена.\n\nДоступные команды:\n📅 /today — Пары на сегодня\n⏳ /now — Какая пара идет прямо сейчас`
  });
}

async function handleMessage(message) {
  const text = message.text?.trim();

  if (text === "/start" || text === "/groups") {
    await sendGroupPicker(message.chat.id);
    return;
  }

  if (text === "/today" || text === "/now") {
    await answerCommand(message.chat.id, text);
    return;
  }

  await telegram("sendMessage", {
    chat_id: message.chat.id,
    // Визуальное отличие: измененный текст-заглушка
    text: "🤔 Не совсем понимаю. Попробуй использовать команды меню: /start, /today или /now."
  });
}

async function poll() {
  while (true) {
    try {
      const updates = await telegram("getUpdates", {
        offset: lastUpdateId + 1,
        timeout: 25
      });

      for (const update of updates) {
        lastUpdateId = update.update_id;

        if (update.callback_query) {
          await handleCallback(update.callback_query);
        } else if (update.message) {
          await handleMessage(update.message);
        }
      }
    } catch (error) {
      console.error(error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

console.log("Duplicate v2 Telegram bot started.");
poll();