// src/routes/authRoutes.js
// ==================================
// Маршрути для User:
// == реєстрація
// == логін
// == логаут
// == оновлення сесії

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

// (5.3) ПОШТА / Маршрут для скидання паролю
// -----------------------------------------
// celebrate(requestResetEmailSchema) запустить перевірку тіла запиту до виконання контролера. Якщо email некоректний — клієнт одразу отримає 400 Bad Request.
// -----------------------------------------
router.post(
  '/auth/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);

// -----------------------------
// (5.7.3) Маршрут / Зміна паролю
// -----------------------------
// Додаємо валідацію та контролер до маршруту
router.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);

export default router;
