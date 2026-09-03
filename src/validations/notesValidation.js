// src/validations/notesValidation.js
// -----------------------------------
// Валідація вхідних даних за допомогою бібліотеки celebrate

import { celebrate, Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна валідація для перевірки MongoDB ObjectId за допомогою mongoose
const validateObjectId = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message(
      'The ID format is incorrect. Must be a valid MongoDB ObjectId',
    );
  }
  return value;
};

// Схема getAllNotesSchema (Пагінація та Фільтрація)
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
export const noteIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    // валідуємо як рядок із кастомною валідацією через isValidObjectId mongoose
    noteId: Joi.string().custom(validateObjectId).required(),
  }),
});

// Схема createNoteSchema (Додано підтримку як старих, так і нових полів разом)
export const createNoteSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    // Старі поля документа, які вже є в базі даних:
    name: Joi.string().min(1).required(),
    age: Joi.number().integer().min(1).required(),
    gender: Joi.string().valid('male', 'female').required(),
    avgMark: Joi.number().min(0).max(12).required(),
    onDuty: Joi.boolean().required(),

    // Нові поля з поточного домашнього завдання:
    // рядок, мінімум 1 символ, обов'язкове поле
    title: Joi.string().min(1).required(),

    // рядок, може бути порожнім рядком, необов'язкове поле
    content: Joi.string().allow('').optional(),

    // одне зі значень із файла src/constants/tags.js, neoбов'язкове поле
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
});

// Схема updateNoteSchema (параметри маршруту та тіло запиту в одній схемі)
export const updateNoteSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    // валідуємо як рядок із кастомною валідацією через isValidObjectId mongoose
    noteId: Joi.string().custom(validateObjectId).required(),
  }),
  [Segments.BODY]: Joi.object()
    .keys({
      // Старі поля для часткового оновлення через PATCH:
      name: Joi.string().min(1).optional(),
      age: Joi.number().integer().min(1).optional(),
      gender: Joi.string().valid('male', 'female').optional(),
      avgMark: Joi.number().min(0).max(12).optional(),
      onDuty: Joi.boolean().optional(),

      // Нові поля з поточного домашнього завдання:
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

//  ===================== ВЕРСІЯ 1 ============================
// // src/validations/notesValidation.js
// // -----------------------------------
// // Валідація вхідних даних за допомогою бібліотеки celebrate

// import { celebrate, Joi, Segments } from 'celebrate';
// import { isValidObjectId } from 'mongoose';
// import { TAGS } from '../constants/tags.js';

// // Кастомна валідація для перевірки MongoDB ObjectId за допомогою mongoose
// const validateObjectId = (value, helpers) => {
//   if (!isValidObjectId(value)) {
//     return helpers.message(
//       'The ID format is incorrect. Must be a valid MongoDB ObjectId',
//     );
//   }
//   return value;
// };

// // GET - Схема getAllNotesSchema
// // (використовується для GET /notes), all notes
// export const getAllNotesSchema = celebrate({
//   [Segments.QUERY]: Joi.object().keys({
//     // ціле число, мінімальне значення 1, за замовчуванням 1
//     page: Joi.number().integer().min(1).default(1),
//     // ціле число, мінімальне значення 5, максимальне 20, за замовчуванням 10
//     perPage: Joi.number().integer().min(5).max(20).default(10),
//     // рядок, одне із можливих значень із файла src/constants/tags.js, необов'язкове поле
//     tag: Joi.string()
//       .valid(...TAGS)
//       .optional(),
//     // рядок, можливо передавати порожній рядок, необов'язкове поле
//     search: Joi.string().allow('').optional(),
//   }),
// });

// // GET - Схема noteIdSchema
// // (використовується для GET /notes/:noteId та DELETE /notes/:noteId)
// export const noteIdSchema = celebrate({
//   [Segments.PARAMS]: Joi.object().keys({
//     // валідуємо як рядок із кастомною валідацією через isValidObjectId mongoose
//     noteId: Joi.string().custom(validateObjectId).required(),
//   }),
// });

// // POST - Схема createNoteSchema
// export const createNoteSchema = celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     // рядок, мінімум 1 символ, обов'язкове поле
//     title: Joi.string().min(1).required(),
//     // рядок, може бути порожнім рядком, необов'язкове поле
//     content: Joi.string().allow('').optional(),
//     // одне зі значень із файла src/constants/tags.js, необов'язкове поле
//     tag: Joi.string()
//       .valid(...TAGS)
//       .optional(),
//   }),
// });

// // PATCH - Схема updateNoteSchema
// // (параметри маршруту та тіло запиту в одній схемі)
// export const updateNoteSchema = celebrate({
//   // ЧАСТИНА 1: Валідація параметрів маршруту (URL-рядка)
//   [Segments.PARAMS]: Joi.object().keys({
//     // валідуємо як рядок із кастомною валідацією через isValidObjectId mongoose
//     noteId: Joi.string().custom(validateObjectId).required(),
//   }),

//   // ЧАСТИНА 2: Валідація тіла запиту (JSON-даних)
//   [Segments.BODY]: Joi.object()
//     .keys({
//       // рядок, мінімум 1 символ, необов'язкове поле
//       title: Joi.string().min(1).optional(),
//       // рядок, може бути порожнім рядком, необов'язкове поле
//       content: Joi.string().allow('').optional(),
//       tag: Joi.string()
//         .valid(...TAGS)
//         // одне із значень із файла src/constants/tags.js, neoбов'язкове поле
//         .optional(),
//     })

//     // Перевірка, що хоча б одне з полів 'title', 'content' або 'tag' буде присутнім (тіло запиту не порожнє)
//     .min(1),
// });
