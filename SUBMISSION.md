# Сдача лабораторной работы N3

## Ссылки

Заполни после публикации:

- GitHub: `https://github.com/<your-login>/schedule-service`
- Issue: `https://github.com/<your-login>/schedule-service/issues/1`
- Pull Request: `https://github.com/<your-login>/schedule-service/pull/1`
- Vercel: `https://<your-vercel-domain>.vercel.app`
- Telegram-бот: `https://t.me/<your_bot_username>`
- Supabase project: `https://supabase.com/dashboard/project/<project-id>`

## Что сделано

- Создан проект `schedule-service`.
- Реализована база данных Supabase с таблицами `groups` и `schedule`.
- Добавлены тестовые данные для двух учебных групп.
- Реализован Telegram-бот с выбором группы.
- Реализованы команды `/today` и `/now`.
- Реализован web-интерфейс чата.
- Подготовлена сборка и публикация на Vercel.
- Подготовлен Pull Request из `feature/frontend` в `main`.

## Проверка для преподавателя

- Репозиторий содержит минимум 4 коммита.
- Есть Issue на разработку интерфейса и Telegram-бота.
- Есть Pull Request из `feature/frontend` в `main`.
- Сайт на Vercel открывается.
- Telegram-бот запускается и отвечает.
- Сайт и бот используют одну базу Supabase.
- Изменение предмета в Supabase отображается и на сайте, и в боте.
- `/now` корректно определяет текущую пару, перемену или завершение учебного дня.
