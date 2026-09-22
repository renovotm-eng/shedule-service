# Schedule Service

Веб-приложение и Telegram-бот для просмотра расписания учебных групп. Данные хранятся в Supabase, а сайт публикуется на Vercel.

## Что реализовано

- Веб-чат с выбором группы и командами `/today` и `/now`.
- Telegram-бот с кнопками выбора группы и командами `/start`, `/groups`, `/today`, `/now`.
- Общая логика для сайта и бота: текущая пара, перемена, конец учебного дня.
- SQL-схема Supabase с таблицами `groups` и `schedule`.
- Тестовые данные минимум для двух групп.
- Демо-режим, если Supabase еще не подключен.

## Быстрый локальный запуск

```bash
npm run dev
```

Открой адрес из терминала. Пока `src/config.js` пустой, сайт работает на демо-данных.

## Supabase

1. Создай новый проект на https://supabase.com.
2. Открой `SQL Editor`.
3. Выполни файл `supabase/schema.sql`.
4. Проверь в `Table Editor`, что появились таблицы `groups` и `schedule`.
5. В `Project Settings -> API` скопируй Project URL и public anon/publishable key.

Для локального сайта можно вставить их в `src/config.js`:

```js
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "your-public-anon-key";
```

Для Vercel лучше использовать Environment Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## Telegram-бот

1. В Telegram открой `@BotFather`.
2. Создай нового бота командой `/newbot`.
3. Скопируй `.env.example` в `.env`.
4. Заполни:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
TELEGRAM_BOT_TOKEN=123456789:telegram-bot-token-from-botfather
```

5. Запусти:

```bash
npm run bot
```

Токен бота нельзя коммитить в GitHub. Файл `.env` уже добавлен в `.gitignore`.

## GitHub и Vercel

1. Создай на GitHub репозиторий `schedule-service`.
2. Привяжи эту папку к репозиторию и отправь ветку `main`.
3. Создай ветку `feature/frontend`.
4. Опубликуй сайт на Vercel из ветки `feature/frontend`.
5. Создай Pull Request из `feature/frontend` в `main`.
6. После проверки слей Pull Request.

Настройки Vercel:

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`

## Проверка

- В GitHub есть минимум 4 коммита.
- В Supabase есть таблицы `groups` и `schedule`.
- На сайте загружаются группы из Supabase.
- В Telegram-боте отображаются те же группы.
- `/today` показывает расписание на текущий день.
- `/now` показывает текущую пару, перемену или что пары закончились.
- Если изменить предмет в Supabase, изменения видны и на сайте, и в Telegram-боте.
