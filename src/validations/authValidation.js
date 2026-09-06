// src/validations/authValidation.js
// =========================================
// Схема валідації (Реєстрація/ЛОГІН користувачів), TASK 04.05

import { Joi, Segments } from 'celebrate';

// Схема валідації auth/register
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

// Схема валідації (Логін користувачів), (4.7)
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
