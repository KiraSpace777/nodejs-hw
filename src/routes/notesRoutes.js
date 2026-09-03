// src/routes/notesRoutes.js
// -------------------------
// Роутер для нотатків

import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

// Імпорт мідлварів валідації
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

// Маршрути з інтегрованою валідацією celebrate
router.get('/notes', getAllNotesSchema, getAllNotes);
router.get('/notes/:noteId', noteIdSchema, getNoteById);
router.post('/notes', createNoteSchema, createNote);
router.delete('/notes/:noteId', noteIdSchema, deleteNote);
router.patch('/notes/:noteId', updateNoteSchema, updateNote);

export default router;

// ================== HW-02 code =======================
// // src/routes/notesRoutes.js
// // ------------------------------------
// // Роутер для нотатків

// import { Router } from 'express';
// import {
//   getAllNotes,
//   getNoteById,
//   createNote,
//   deleteNote,
//   updateNote,
// } from '../controllers/notesController.js';

// const router = Router();

// router.get('/notes', getAllNotes);
// router.get('/notes/:noteId', getNoteById);
// router.post('/notes', createNote);
// router.delete('/notes/:noteId', deleteNote);
// router.patch('/notes/:noteId', updateNote);

// export default router;
