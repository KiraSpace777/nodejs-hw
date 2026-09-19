// src/server.js
// ------------------------------------------------------
// npm init -y === Ініціалізує npm: файл package.json.
// npm install -D nodemon === автоматично перезапускає застосунок.
// npm init @eslint/config@latest === задати єдиний стиль написання коду
// npm install express ===  мінімалістичний веб-фреймворк для Node.js
// npm install cors === дозволяє браузеру робити запити з одного домену до іншого
// npm install pino-http pino-pretty ===  Логування запитів (вхідні/вихідні запити, час обробки)
// npm install dotenv ===  зчитування змінних оточення
// npm install mongoose === бібліотека Mongoose, підключення до MongoDB (БД)
// npm install http-errors === пакет http-errors дозволяє створювати помилки з потрібним статусом і повідомленням.
// npm install celebrate  ===	Бібліотеки валідації: Joi + celebrate (включає Joi).
// npm install bcrypt  === Бібліотека для безпечного хешування паролів, додає до паролю сіль (salt) — випадковий рядок
// npm install cookie-parser === парсер для Cookies
// npm install nodemailer === бібліотекою nodemailer: функціонал відправлення листів
// npm install jsonwebtoken  === бібліотеку для роботи з токен JWT
// npm install mailgun.js === бібліотекою mailgun: функціонал відправлення листів
// npm install handlebars  === популярний шаблонізатор для JavaScript (для створення листа, з гарним форматуванням, замість шаблонного рядку)
// npm install multer  === middleware multer для завантаження зображень (наприклад, аватарка)
// npm install cloudinary	=== хмарний сервіс для керування зображеннями та відео

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate'; // ДОДАНО: Імпорт вбудованого мідлвару для обробки помилок celebrate
import cookieParser from 'cookie-parser';

import connectMongoDB from './db/connectMongoDB.js';

// Імпортуємо middleware
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

// Імпортуємо маршрути
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware list
// ==========================================

// Глобальні middleware
app.use(logger); // 1. Middleware, Логер pino, першим — бачить усі запити

// 2. Middleware з типізацією для стандартного парсингу JSON + парсингу за специфікацією JSON:API
// ВАЖЛИВО: без тіла "req.body", без "Content-Type: application/json" і без "express.json()" у тебе завжди буде порожній "req.body".
app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb', // максимум 100 кілобайт
  }),
);

app.use(cors()); // 3. Middleware, дозвіл для запитів з інших доменів
app.use(cookieParser()); // (module 4) Cookies / Піключаємо парсер кук

// МАРШРУТИ (РОУТИ)
// ------------------------------
// підключаємо групу маршрутів користувача (User), (4.5 - Реєстрація користувачів)
app.use(authRoutes);

// підключаємо групу маршрутів нотатків
app.use(notesRoutes);

// підключаємо маршрути користувача
app.use(userRoutes);

// ДОДАНО: Обробник помилок від celebrate (має стояти ПЕРЕД кастомними errorHandler та після маршрутів)
// Він перехоплює помилки валідації Joi і повертає статус 400 Bad Request із деталями помилки клієнту
app.use(errors());

// Middleware 404 - якщо маршрут не знайдено (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware 500 (Error) - якщо під час запиту виникла помилка (останнє)
app.use(errorHandler);

// Підключення до MongoDB
// ==========================================
await connectMongoDB();

// Запуск сервера
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ======================= (5.8.1) =====================
// (5.8.1) Аватар користувача  / оновлюємо модель userSchema, додаємо необов’язкову властивість
// ----------------------
// src/models/user.js
// ======================= (5.8.2) =====================
// (5.8.2) Аватар користувача  / КОНТРОЛЛЕР / Маршрут "/users/me/avatar"
// ----------------------
// src/controllers/userController.js
// ======================= (5.8.3) =====================
// (5.8.3) Аватар користувача / РОУТЕР  / Маршрут " /users": Middleware authenticate
// ----------------------
// src/routes/userRoutes.js
// ======================= (5.8.4) =====================
// Аватар користувача  / додаємо нові раути userRoutes у server.js
// ----------------------
// src/server.js
//
// у файлі src/server.js імпортуємо нові раути та додаємо їх через app.use
//
// ==========================================
// Взаємодія з базою даних "cloud.mongodb"
// src/server.js
// ==========================================
// Ми спочатку налаштували базу даних та підключення до неї
// src/db/connectMongoDB.js
// ------------------------------------
// оновили підключення для БД напряму, саме до бази даних "студентів" через env файл
// .env
// ------------------------------------
// Тепер, коли ми вже маємо базу students та модель Student, додамо маршрути для взаємодії з нею.
// src/models/student.js
// ------------------------------------
// Маршрут: отримати всіх студентів
// ------------------------------------
// У цьому маршруті ми будемо звертатися до колекції students через вбудований метод Mongoose Student.find(), який повертає масив документів (може бути порожнім), що відповідають моделі Student
// ------------------------------------
// Маршрут: отримати одного студента за id
// ------------------------------------
// Для цього маршруту ми використаємо вбудований метод Mongoose Student.findById(). Якщо документ із заданим ідентифікатором не буде знайдено, метод поверне null. У такому випадку ми повернемо статус 404.
//------------------------------------
// Тепер ми маємо:
// ------------------------------------
// GET http://localhost:3000/students → повертає всіх студентів.
// GET http://localhost:3000/students/:studentId → повертає одного студента або 404, якщо такого немає.
