// src/controllers/notesController.js
// ===================================

import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Маршрут GET запиту "/ notes" - отримати повний список нотатків з урахуванием фільтрації та пагінації
export const getAllNotes = async (req, res) => {
  // Витягуємо параметри рядка запиту (Query Parameters)
  const { page, perPage, tag, search } = req.query;

  // Конвертуємо параметри пагінації у числа (де page та perPage є числами)
  const parsedPage = Number(page);
  const parsedPerPage = Number(perPage);

  // Створюємо базовий об'єкт фільтрації
  const filter = {};

  // Додаємо фільтр за тегом ТІЛЬКИ якщо він переданий у параметрах рядка запиту
  if (tag) {
    filter.tag = tag;
  }

  // Розраховуємо скільки елементів потрібно пропустити (skip) для пагінації
  const skip = (parsedPage - 1) * parsedPerPage;

  // Створюємо окремий фільтр для точного підрахунку totalNotes з урахуванням текстового пошуку
  const countFilter = { ...filter };
  if (search) {
    countFilter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  // Виконуємо запит до бази даних: рахуємо загальну кількість нотаток, які підходять під умови
  const totalNotes = await Note.countDocuments(countFilter);

  // ТУТ ВСЕ СУВОРО ЗА ВКАЗІВКОЮ З ТЗ:
  // 1. Спочатку створюємо базовий запит Note.find(filter)
  const myQuery = Note.find(filter);

  // 2. Якщо є текст для пошуку — застосовуємо конструкцію .where() строго за шаблоном з ДЗ
  if (search) {
    myQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  // 3. Пагінацію (.skip та .limit) додаємо до об'єкта запиту ПІСЛЯ .where(), але ДО await!
  myQuery.skip(skip).limit(parsedPerPage);

  // Виконуємо сформований запит
  const notes = await myQuery;

  // Розраховуємо загальну кількість сторінок
  const totalPages = Math.ceil(totalNotes / parsedPerPage);

  // (Пагінація): відповідь сервера зі статусом 200, містить об'єкт із наступними властивостями:
  res.status(200).json({
    page: parsedPage,
    perPage: parsedPerPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// Маршрут GET запиту " /notes/:noteId " - отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  // Додаємо базову обробку помилки замість обробника res.status(404)
  // та throw new Error(), через пакет http-errors та функцію createHttpError() у
  // файлі // src/controllers/notesController.js
  // оновимо відповідно і файл "// src/middleware/errorHandler.js"
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Маршрут POST (create) запиту - СТВОРЕННЯ елементу по схемі Note
// для запитів, які щось створюють, відповідь зі статус-кодом 201 Created
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// Маршрут DELETE запиту
// Додаємо маршрут DELETE /notes/:noteId (файл: // src/routes/notesRoutes.js). Для
// видалення документа з колекції в Mongoose використовується метод (в контролерах):
// FindOneAndDelete(filter, options), файл: // src/controllers/notesController.js
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Маршрут PATCH запиту (оновлення)
// У контролері беремо noteId з параметрів, req.body - дані для часткового
// оновлення. Якщо нотатку не знайдено - повертаємо 404. Якщо все добре - повертаємо
// 200 і оновлений документ.
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  // Якщо ID валідний за форматом, виконуємо оновлення в базі даних
  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо нотатку за цим ID
    req.body, // дані з тіла запиту для часткового оновлення
    { returnDocument: 'after' }, // Повертаємо вже оновлений документ
  );

  // Якщо формат ID правильний, але такої нотатки взагалі немає в базі даних
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  // Якщо все добре - повертаємо статус 200 та оновлені дані нотатки
  res.status(200).json(note);
};

//  ===================== ВЕРСІЯ 1 ============================
// // src/controllers/notesController.js
// // ===================================
// import { Note } from '../models/note.js';
// import createHttpError from 'http-errors';

// // Маршрут GET запиту "/ notes" - отримати повний список нотатків з урахуванням фільтрації та пагінації
// export const getAllNotes = async (req, res) => {
//   // Витягуємо параметри рядка запиту (Query Parameters)
//   const { page, perPage, tag, search } = req.query;

//   // Конвертуємо параметри пагінації у числа (де page та perPage є числами)
//   const parsedPage = Number(page);
//   const parsedPerPage = Number(perPage);

//   // Створюємо базовий об'єкт фільтрації
//   const filter = {};

//   // Додаємо фільтр за тегом, якщо він переданий
//   if (tag) {
//     filter.tag = tag;
//   }

//   // Розраховуємо скільки елементів потрібно пропустити (skip) для пагінації
//   const skip = (parsedPage - 1) * parsedPerPage;

//   // Виконуємо запит до бази даних: рахуємо загальну кількість нотаток, які підходять під фільтр
//   const totalNotes = await Note.countDocuments(filter);

//   // Ініціалізуємо базовий запит Mongoose (пошук за фільтром тегу та пагінацією)
//   const myQuery = Note.find(filter).skip(skip).limit(parsedPerPage);

//   // Для текстового пошуку використовуйте оператор $regex через myQuery.where()
//   if (search) {
//     myQuery.where({
//       $or: [
//         { title: { $regex: search, $options: 'i' } },
//         { content: { $regex: search, $options: 'i' } },
//       ],
//     });
//   }

//   // Виконуємо сформований запит
//   const notes = await myQuery;

//   // Розраховуємо загальну кількість сторінок
//   const totalPages = Math.ceil(totalNotes / parsedPerPage);

//   // (Пагінація): відповідь сервера зі статусом 200, містити об'єкт із наступними властивостями:
//   res.status(200).json({
//     page: parsedPage,
//     perPage: parsedPerPage,
//     totalNotes,
//     totalPages,
//     notes,
//   });
// };

// // Маршрут GET запиту " /notes/:noteId " - отримати одну нотатку за id
// export const getNoteById = async (req, res) => {
//   const { noteId } = req.params;
//   const note = await Note.findById(noteId);

//   // Додаємо базову обробку помилки замість обробника res.status(404)
//   // та throw new Error(), через пакет http-errors та функцію createHttpError() у
//   // файлі // src/controllers/notesController.js
//   // оновимо відповідно і файл "// src/middleware/errorHandler.js"
//   if (!note) {
//     throw createHttpError(404, 'Note not found');
//   }

//   res.status(200).json(note);
// };

// // Маршрут POST (create) запиту - СТВОРЕННЯ елементу по схемі Note
// // для запитів, які щось створюють, відповідь зі статус-кодом 201 Created
// export const createNote = async (req, res) => {
//   const note = await Note.create(req.body);
//   res.status(201).json(note);
// };

// // Маршрут DELETE запиту
// // Додаємо маршрут DELETE /notes/:noteId (файл: // src/routes/notesRoutes.js). Для
// // видалення документа з колекції в Mongoose використовується метод (в контролерах):
// // FindOneAndDelete(filter, options), файл: // src/controllers/notesController.js
// export const deleteNote = async (req, res) => {
//   const { noteId } = req.params;
//   const note = await Note.findOneAndDelete({
//     _id: noteId,
//   });

//   if (!note) {
//     throw createHttpError(404, 'Note not found');
//   }

//   res.status(200).json(note);
// };

// // Маршрут PATCH запиту (оновлення)
// // У контролері беремо noteId з параметрів, req.body - дані для часткового
// // оновлення. Якщо нотатку не знайдено - повертаємо 404. Якщо все добре - повертаємо
// // 200 і оновлений документ.
// export const updateNote = async (req, res) => {
//   const { noteId } = req.params;

//   // Якщо ID валідний за форматом, виконуємо оновлення в базі даних
//   const note = await Note.findOneAndUpdate(
//     { _id: noteId }, // Шукаємо нотатку за цим ID
//     req.body, // дані з тіла запиту для часткового оновлення
//     { returnDocument: 'after' }, // Повертаємо вже оновлений документ
//   );

//   // Якщо формат ID правильний, але такої нотатки взагалі немає в базі даних
//   if (!note) {
//     throw createHttpError(404, 'Note not found');
//   }

//   // Якщо все добре - повертаємо статус 200 та оновлені дані нотатки
//   res.status(200).json(note);
// };

// ==================== HW-02 ============================
// // src/controllers/notesController.js
// // =====================================================

// import { Note } from '../models/note.js';
// import createHttpError from 'http-errors';
// // import mongoose from 'mongoose';

// // Маршрут GET запиту "/ notes" - отримати повний список нотатків
// // ====================================================
// export const getAllNotes = async (req, res) => {
//   const notes = await Note.find();
//   res.status(200).json(notes);
// };

// // Маршрут GET запиту " /notes/:noteId " - отримати одну нотатку за id
// // ====================================================
// export const getNoteById = async (req, res) => {
//   const { noteId } = req.params;
//   const note = await Note.findById(noteId);

//   // Додаємо базову обробку помилки замість обробника res.status(404)
//   // та throw new Error(), через пакет http-errors та функцію createHttpError () у файлі // src/controllers/notesController.js
//   // оновимо відповідно і файл "// src/middleware/errorHandler.js"
//   // -------------------------------------------------
//   if (!note) {
//     throw createHttpError(404, 'Note not found');
//   }

//   res.status(200).json(note);
// };

// // Маршрут POST (create) запиту - СТВОРЕННЯ елементу по схемі Note
// // ====================================================
// // для запитів, які щось створюють, відповідь зі статус-кодом 201 Created

// export const createNote = async (req, res) => {
//   const note = await Note.create(req.body);
//   res.status(201).json(note);
// };

// // Маршрут DELETE запиту
// // ====================================================
// // Додаємо маршрут DELETE /notes/:noteId (файл: // src/routes/notesRoutes.js). Для видалення документа з колекції в Mongoose використовується метод (в контролерах): findOneAndDelete(filter, options), файл: // src/controllers/notesController.js
// // ------------------------------------
// export const deleteNote = async (req, res) => {
//   const { noteId } = req.params;
//   const note = await Note.findOneAndDelete({
//     _id: noteId,
//   });

//   if (!note) {
//     throw createHttpError(404, 'Note not found');
//   }

//   res.status(200).json(note);
// };

// // Маршрут PATCH запиту (оновлення)
// // ====================================================
// // У контролері беремо noteId з параметрів, req.body — дані для часткового оновлення. Якщо нотатку не знайдено — повертаємо 404. Якщо все добре — повертаємо 200 і оновлений документ.
// // ------------------------------------
// export const updateNote = async (req, res) => {
//   const { noteId } = req.params;

//   // УМОВА 1: Перевіряємо, чи є ID валідним для MongoDB (має бути рівно 24 символи). Якщо формат невалідний, ми перехоплюємо помилку ДО запиту в базу даних, щоб уникнути помилки 500
//   // if (!mongoose.Types.ObjectId.isValid(noteId)) {
//   //   throw createHttpError(
//   //     404,
//   //     `The ID code (string length) is incorrect. The specified string length [${noteId.length}] is less than the database standard [24]`,
//   //   );
//   // }

//   // Якщо ID валідний за форматом, виконуємо оновлення в базі даних
//   const note = await Note.findOneAndUpdate(
//     { _id: noteId }, // Шукаємо нотатку за цим ID
//     req.body, // Дані з тіла запиту для часткового оновлення
//     { returnDocument: 'after' }, // Повертаємо вже оновлений документ
//   );

//   // УМОВА 2: Якщо формат ID правильний, але такої нотатки взагалі немає в базі даних
//   if (!note) {
//     throw createHttpError(404, 'Note not found');
//   }

//   // Якщо все добре — повертаємо статус 200 та оновлені дані нотатки
//   res.status(200).json(note);
// };
