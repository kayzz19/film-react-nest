# Backend

Backend приложения **FILM!**, разработанный с использованием NestJS, TypeScript, TypeORM и PostgreSQL.

## Требования

- Node.js 18+
- PostgreSQL 14+

## Установка

Перейдите в папку backend:

```bash
cd backend
```

Установите зависимости:

```bash
npm install
```

## Настройка

Создайте файл `.env` на основе `.env.example`.

Пример:

```env
DATABASE_URL=postgres://username:password@localhost:5432/practicum
PORT=3000
```

## Запуск

Режим разработки:

```bash
npm run start:dev
```

Обычный запуск:

```bash
npm run start
```

Production:

```bash
npm run build
npm run start:prod
```

## Проверка проекта

Сборка:

```bash
npm run build
```

Проверка линтера:

```bash
npm run lint
```

Тесты:

```bash
npm run test
```