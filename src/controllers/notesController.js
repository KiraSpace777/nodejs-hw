// src/controllers/notesController.js
// =====================================================

import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
// import mongoose from 'mongoose';

// Маршрут GET запиту "/ notes" - отримати повний список нотатків
// ====================================================
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

// Маршрут GET запиту " /notes/:noteId " - отримати одну нотатку за id
// ====================================================
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  // Додаємо базову обробку помилки замість обробника res.status(404)
  // та throw new Error(), через пакет http-errors та функцію createHttpError () у файлі // src/controllers/notesController.js
  // оновимо відповідно і файл "// src/middleware/errorHandler.js"
  // -------------------------------------------------
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Маршрут POST (create) запиту - СТВОРЕННЯ елементу по схемі Note
// ====================================================
// для запитів, які щось створюють, відповідь зі статус-кодом 201 Created

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// Маршрут DELETE запиту
// ====================================================
// Додаємо маршрут DELETE /notes/:noteId (файл: // src/routes/notesRoutes.js). Для видалення документа з колекції в Mongoose використовується метод (в контролерах): findOneAndDelete(filter, options), файл: // src/controllers/notesController.js
// ------------------------------------
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
// ====================================================
// У контролері беремо noteId з параметрів, req.body — дані для часткового оновлення. Якщо нотатку не знайдено — повертаємо 404. Якщо все добре — повертаємо 200 і оновлений документ.
// ------------------------------------
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  // УМОВА 1: Перевіряємо, чи є ID валідним для MongoDB (має бути рівно 24 символи). Якщо формат невалідний, ми перехоплюємо помилку ДО запиту в базу даних, щоб уникнути помилки 500
  // if (!mongoose.Types.ObjectId.isValid(noteId)) {
  //   throw createHttpError(
  //     404,
  //     `The ID code (string length) is incorrect. The specified string length [${noteId.length}] is less than the database standard [24]`,
  //   );
  // }

  // Якщо ID валідний за форматом, виконуємо оновлення в базі даних
  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо нотатку за цим ID
    req.body, // Дані з тіла запиту для часткового оновлення
    { returnDocument: 'after' }, // Повертаємо вже оновлений документ
  );

  // УМОВА 2: Якщо формат ID правильний, але такої нотатки взагалі немає в базі даних
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  // Якщо все добре — повертаємо статус 200 та оновлені дані нотатки
  res.status(200).json(note);
};
