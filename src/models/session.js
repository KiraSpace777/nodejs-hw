// src/models/session.js
// ---------------------------
// Cесії / Модель сесії

import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Session = model('Session', sessionSchema);

// ================== (TASK 04.02 - to do list) ==================
// Модель сесії
// ----------------------------------------------
// У файлі src/models/session.js створіть модель Session із такими властивостями:

// userId — тип Schema.Types.ObjectId, обов’язкове;
// accessToken — рядок, обов’язкове;
// refreshToken — рядок, обов’язкове;
// accessTokenValidUntil — тип Date, обов’язкове;
// refreshTokenValidUntil — тип Date, обов’язкове.

// Для автоматичного створення полів createdAt та updatedAt, використовуйте параметр timestamps: true при створенні моделі.

// ======================= (COMMENTS) =====================
// Ми зберігаємо сесію в колекції sessions. Вона містить токени та їх строки дії, а також посилання на користувача.

// Що зберігаємо:
// accessToken — короткоживучий токен (у нас 15 хвилин).
// accessTokenValidUntil — коли accessToken спливає.
// refreshToken — довшоживучий токен (у нас 1 день), щоб оновити пару токенів.
// refreshTokenValidUntil — коли refreshToken спливає.
// userId — власник сесії.
