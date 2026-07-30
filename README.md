# FILM!

## Установка

### PostgreSQL

Установите PostgreSQL любым удобным способом (с официального сайта или через пакетный менеджер).

Создайте базу данных и выполните SQL-скрипты из папки `test`:

```
prac.init.sql
prac.films.sql
prac.schedule.sql
```

### Бэкенд

Перейдите в папку проекта:

```bash
cd backend
```

Установите зависимости:

```bash
npm install
```

Создайте файл `.env` на основе `.env.example`.

Укажите параметры подключения к PostgreSQL:

```env
DATABASE_URL=postgres://username:password@localhost:5432/practicum
PORT=3000
```

где:

- `username` — имя пользователя PostgreSQL;
- `password` — пароль пользователя;
- `localhost` — адрес сервера PostgreSQL;
- `5432` — порт PostgreSQL;
- `practicum` — название базы данных.

После этого запустите сервер:

```bash
npm run start:dev
```

или

```bash
npm run start
```

API будет доступно по адресу

```
http://localhost:3000/api/afisha
```

## Используемые технологии

- NestJS
- TypeScript
- TypeORM
- PostgreSQL

## Сборка проекта

```bash
cd backend
npm run build
```
