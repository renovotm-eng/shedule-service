export const WEEKDAY_NAMES = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
  7: "Воскресенье"
};

export function getIsoDay(date = new Date()) {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

export function timeToMinutes(value) {
  const [hours, minutes] = String(value).slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatLesson(lesson) {
  return `${lesson.lesson_number} пара: ${lesson.subject_name} (${lesson.time_start.slice(0, 5)} - ${lesson.time_end.slice(0, 5)})`;
}

export function lessonsForToday(lessons, date = new Date()) {
  const today = getIsoDay(date);
  return lessons
    .filter((lesson) => Number(lesson.day_of_week) === today)
    .sort((a, b) => Number(a.lesson_number) - Number(b.lesson_number));
}

export function buildTodayAnswer(lessons, groupName, date = new Date()) {
  const todayLessons = lessonsForToday(lessons, date);
  const dayName = WEEKDAY_NAMES[getIsoDay(date)];

  if (todayLessons.length === 0) {
    return `Для группы ${groupName} на ${dayName.toLowerCase()} пары не найдены.`;
  }

  return `Расписание группы ${groupName} на ${dayName.toLowerCase()}:\n${todayLessons
    .map(formatLesson)
    .join("\n")}`;
}

export function buildNowAnswer(lessons, groupName, date = new Date()) {
  const todayLessons = lessonsForToday(lessons, date);

  if (todayLessons.length === 0) {
    return `У группы ${groupName} сегодня нет пар.`;
  }

  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const activeLesson = todayLessons.find((lesson) => {
    const start = timeToMinutes(lesson.time_start);
    const end = timeToMinutes(lesson.time_end);
    return currentMinutes >= start && currentMinutes <= end;
  });

  if (activeLesson) {
    return `Сейчас идет ${formatLesson(activeLesson)}.`;
  }

  const nextLesson = todayLessons.find((lesson) => currentMinutes < timeToMinutes(lesson.time_start));

  if (nextLesson) {
    return `Сейчас перемена. Следующая пара в ${nextLesson.time_start.slice(0, 5)}: ${nextLesson.subject_name}.`;
  }

  return "На сегодня все пары закончились.";
}
