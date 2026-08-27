// src/models/note.js
// --------------------------------
// Mongoose /  MongoDB

import { Schema } from 'mongoose';
import { model } from 'mongoose';

// Схема нотатки
// ----------------------------------
const NOTE_TAGS = Object.freeze([
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
]);

// Визначення схеми для моделі Note
export const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Заголовок є обов’язковим полем'], // Кастомне повідомлення про помилку
      trim: true, // Автоматично видаляє пробіли на початку та в кінці рядка
    },
    content: {
      type: String,
      default: '', // Значення за замовчуванням — порожній рядок
      trim: true,
    },
    tag: {
      type: String,
      enum: {
        values: NOTE_TAGS, // Передаємо наш масив фіксованих значень
        message: '{VALUE} не є дозволеним тегом', // Помилка, якщо передано значення не зі списку
      },
      default: 'Todo', // Значення за замовчуванням, якщо тег не передали
    },
  },
  {
    // Автоматично створює та оновлює поля createdAt та updatedAt
    timestamps: true,
    // Вимикає системне поле версії _ _v, яке Mongoose додає за замовчуванням
    versionKey: false,
  },
);

// Створення моделі на основі схеми
// Mongoose сам зробить з Note -> notes
export const Note = model('Note', noteSchema);

// ================ Mongoose /  MongoDB (important )===================
// Потрібно знати одне головне правило Mongoose при формуванні моделі та бази колекції (бази даних): За замовчуванням Mongoose бере назву вашої моделі (перший аргумент у model()), переводить її в нижній регістр і робить її у множині.
// -----------------------------------
// Потрібно перевірити, якщо у коді написано: model('Note', noteSchema) або model('note', noteSchema), тоді:
//  1)  Mongoose шукає в базі: Колекцію з назвою notes (з літерою s на кінці та з маленької літери).
//  2) що має бути в інтерфейсі (Compass): Назва вашої колекції всередині бази даних повинна бути саме notes.
