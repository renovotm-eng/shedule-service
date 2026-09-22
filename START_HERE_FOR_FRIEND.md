# Начни отсюда

Это готовый проект для лабораторной работы N3. Внутри уже есть сайт, Telegram-бот, SQL-схема Supabase, Vercel-настройки и несколько Git-коммитов.

## Если в архиве есть папка `.git`

Так проще сохранить историю коммитов для проверки.

1. Распакуй архив.
2. Открой папку в GitHub Desktop как existing repository.
3. Создай пустой репозиторий `schedule-service` в своем GitHub.
4. Привяжи remote к своему репозиторию:

```bash
git remote add origin https://github.com/<your-login>/schedule-service.git
git branch -M main
git push -u origin main
```

Если remote уже существует:

```bash
git remote set-url origin https://github.com/<your-login>/schedule-service.git
git push -u origin main
```

## Что поменять под себя

1. Создай свой Supabase-проект и выполни `supabase/schema.sql`.
2. Для сайта вставь публичные ключи Supabase в `src/config.js` или в Vercel Environment Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

3. Для бота создай `.env` из `.env.example` и заполни:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
TELEGRAM_BOT_TOKEN=123456789:telegram-bot-token-from-botfather
```

4. Создай Telegram-бота через `@BotFather`.
5. Запусти бота:

```bash
npm run bot
```

6. Задеплой сайт на Vercel:

```bash
npm run build
```

Vercel settings:

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`

## Что показать при сдаче

- GitHub-репозиторий `schedule-service`.
- Issue на разработку.
- Pull Request из `feature/frontend` в `main`.
- Vercel-сайт.
- Telegram-бот.
- Supabase с двумя таблицами и тестовыми данными.
