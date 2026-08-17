// src/server.js
// ------------------------------------------------------
// npm init -y === Ініціалізує npm: файл package.json.
// npm install -D nodemon === автоматично перезапускає застосунок.
// npm init @eslint/config@latest === задати єдиний стиль написання коду
// npm install express ===  мінімалістичний веб-фреймворк для Node.js
// npm install cors === дозволяє браузеру робити запити з одного домену до іншого
// npm install pino-http pino-pretty ===  Логування запитів (вхідні/вихідні запити, час обробки)
// npm install dotenv ===  зчитування змінних оточення
// ------------------------------------------------------

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

// Для вірного імпорту dotenv явно вкажемо розташування файлу
// -----------------------------------------------
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT ?? 3000; // Використовуємо значення з .env або дефолтний порт 3000
// const PORT = Number(process.env.PORT) || 3000;
// // можна ще так написати, з явним використанням Number

// ===============================================
// Middleware list (start), app.use
// ===============================================

app.use(express.json()); // Middleware для парсингу JSON
app.use(cors()); // CORS - дозволяє запити з будь-яких джерел

// Логування запитів
// -----------------------------------------------
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// Логування часу
// -----------------------------------------------
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// ===============================================
// МАРШРУТИ
// ===============================================

// Маршрут кореневий (до списку нотаток)
// -----------------------------------------------
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Маршрут до певної нотатки (за id)
// -----------------------------------------------
app.get('/notes/:noteId', (req, res) => {
  const id_param = Number(req.params.noteId);
  res.status(200).json({
    message: `Retrieved note with ID: ${id_param}`,
  });
});

// Маршрут для тестування middleware помилки
// GET http://localhost:3000/test-error
// GET {{domain}}/test-error
// -----------------------------------------------
app.get('/test-error', (req, res) => {
  // Штучна помилка для прикладу
  throw new Error('Simulated server error');
});

// ===============================================
// Middleware list (end), app.use
// ===============================================

// Middleware 404, обробка неіснуючих маршрутів (після всіх маршрутів)
// -----------------------------------------
// GET http://localhost:3000/random
// GET {{domain}}/random
// -----------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware 500, перехоплення та обробка помилок (останній)
// -----------------------------------------
// з врахуванням змінної ENV 'production'
// та обмеження в режимі продакшн відображення деталей помилки
// -----------------------------------------
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

// ===============================================
// Запуск сервера
// ===============================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ======================= (КОМЕНТАРІ) =========================
// Логування часу у поточному коді виконується не під час перезапуску сервера, а при кожному HTTP-запиті від клієнта до цього сервера.
// Так як ми винесли функцію console.log всередину проміжного ПЗ (middleware) app.use((req, res, next) => { ... }). Цей блок коду спрацьовує виключно тоді, коли хтось (наприклад, ми через браузер або Postman) звертається до сервера за адресою http://localhost:3000/.
