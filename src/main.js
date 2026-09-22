import { buildNowAnswer, buildTodayAnswer } from "./scheduleLogic.js";
import { loadGroups, loadSchedule, usingDemoData } from "./scheduleApi.js";

const groupSelect = document.querySelector("#groupSelect");
const messages = document.querySelector("#messages");
const commandForm = document.querySelector("#commandForm");
const commandInput = document.querySelector("#commandInput");
const dataStatus = document.querySelector("#dataStatus");
const clock = document.querySelector("#clock");

let groups = [];
let lessons = [];

function addMessage(text, type = "bot") {
  const message = document.createElement("article");
  message.className = `message ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  message.append(bubble);
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

function getSelectedGroup() {
  return groups.find((group) => Number(group.id) === Number(groupSelect.value));
}

async function refreshSchedule() {
  const selectedGroup = getSelectedGroup();

  if (!selectedGroup) {
    lessons = [];
    return;
  }

  lessons = await loadSchedule(selectedGroup.id);
}

async function handleCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  const selectedGroup = getSelectedGroup();

  if (!selectedGroup) {
    addMessage("Сначала выберите группу.");
    return;
  }

  await refreshSchedule();

  if (command === "/today") {
    addMessage(buildTodayAnswer(lessons, selectedGroup.name));
    return;
  }

  if (command === "/now") {
    addMessage(buildNowAnswer(lessons, selectedGroup.name));
    return;
  }

  addMessage("Команда не распознана. Доступны /today и /now.");
}

function renderGroups() {
  groupSelect.innerHTML = "";

  for (const group of groups) {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    groupSelect.append(option);
  }
}

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

async function init() {
  updateClock();
  setInterval(updateClock, 30_000);

  try {
    groups = await loadGroups();
    renderGroups();
    await refreshSchedule();
    dataStatus.textContent = usingDemoData()
      ? "Демо-данные. Подключите Supabase в src/config.js или через Vercel env."
      : "Подключено к Supabase.";
    addMessage("Выберите группу и отправьте /today или /now. Кнопки слева делают то же самое.");
  } catch (error) {
    dataStatus.textContent = "Ошибка загрузки данных.";
    addMessage(error.message);
  }
}

groupSelect.addEventListener("change", async () => {
  await refreshSchedule();
  const selectedGroup = getSelectedGroup();
  addMessage(`Выбрана группа ${selectedGroup.name}.`);
});

document.querySelector("#todayButton").addEventListener("click", () => handleCommand("/today"));
document.querySelector("#nowButton").addEventListener("click", () => handleCommand("/now"));

commandForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const command = commandInput.value;
  commandInput.value = "";
  addMessage(command, "user");
  await handleCommand(command);
});

init();
