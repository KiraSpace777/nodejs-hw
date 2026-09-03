// src/validations/notesValidation.js
// -----------------------------------
// Валідація вхідних даних за допомогою бібліотеки celebrate

import { celebrate, Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна валідація для перевірки MongoDB ObjectId за допомогою mongoose
// ----------------------------------------------------
const validateObjectId = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message(
      'The ID format is incorrect. Must be a valid MongoDB ObjectId',
    );
  }
  return value;
};

// Схема getAllNotesSchema (Пагінація та Фільтрація)
// ----------------------------------------------------
export const getAllNotesSchema = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    // ціле число, мінімальне значення 1, за замовчуванням 1
    page: Joi.number().integer().min(1).default(1),

    // ціле число, мінімальне значення 5, максимальне 20, за замовчуванням 10
    perPage: Joi.number().integer().min(5).max(20).default(10),

    // рядок, одне із можливих значень із файла src/constants/tags.js, необов'язкове поле
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),

    // рядок, можливо передавати порожній рядок, необов'язкове поле
    search: Joi.string().allow('').optional(),
  }),
});

// Схема noteIdSchema (використовується для GET /notes/:noteId та DELETE /notes/:noteId)
// ----------------------------------------------------
export const noteIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    // валідуємо як рядок із кастомною валідацією через isValidObjectId mongoose
    noteId: Joi.string().custom(validateObjectId).required(),
  }),
});

// Схема createNoteSchema (активна версія без сторонніх полів студентів)
// ----------------------------------------------------
export const createNoteSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    // рядок, мінімум 1 символ, обов'язкове поле
    title: Joi.string().min(1).required(),

    // рядок, може бути порожнім рядком, необов'язкове поле
    content: Joi.string().allow('').optional(),

    // одне зі значень із файла src/constants/tags.js, необов'язкове поле
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
});

// Схема updateNoteSchema (параметри маршруту та тіло запиту в одній схемі)
// ----------------------------------------------------
export const updateNoteSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    // валідуємо як рядок із кастомною валідацією через isValidObjectId mongoose
    noteId: Joi.string().custom(validateObjectId).required(),
  }),
  [Segments.BODY]: Joi.object()
    .keys({
      // рядок, мінімум 1 символ, необов'язкове поле
      title: Joi.string().min(1).optional(),

      // рядок, може бути порожнім рядком, необов'язкове поле
      content: Joi.string().allow('').optional(),

      // одне із значень із файла src/constants/tags.js, необов'язкове поле
      tag: Joi.string()
        .valid(...TAGS)
        .optional(),
    })
    // Перевірка, що хоча б одне з полів буде присутнім у тілі запиту
    .min(1),
});
