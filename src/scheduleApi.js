import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config.js";
import { demoGroups, demoSchedule } from "./demoData.js";

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function usingDemoData() {
  return !hasSupabaseConfig;
}

async function supabaseGet(table, searchParams = new URLSearchParams()) {
  const url = new URL(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}`);
  url.search = searchParams.toString();

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase вернул ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function loadGroups() {
  if (!hasSupabaseConfig) {
    return demoGroups;
  }

  return supabaseGet("groups", new URLSearchParams({
    select: "id,name",
    order: "name.asc"
  }));
}

export async function loadSchedule(groupId) {
  if (!hasSupabaseConfig) {
    return demoSchedule.filter((lesson) => Number(lesson.group_id) === Number(groupId));
  }

  return supabaseGet("schedule", new URLSearchParams({
    select: "id,group_id,day_of_week,lesson_number,subject_name,time_start,time_end",
    group_id: `eq.${groupId}`,
    order: "day_of_week.asc,lesson_number.asc"
  }));
}
