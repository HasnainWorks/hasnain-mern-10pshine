const Note = require("../models/Note");
const logger = require("../utils/logger");

const createNote = async (title, content, userId) => {
  if (!title) {
    const error = new Error("Title is required");
    error.status = 400;
    throw error;
  }
  const note = await Note.create({ title, content, user: userId });
  logger.info(`Note created by user: ${userId}`);
  return note;
};

const getNotes = async (userId) => {
  const notes = await Note.find({ user: userId, isDeleted: false }).sort({
    isPinned: -1,
    updatedAt: -1,
  });
  logger.info(`Notes fetched by user: ${userId}`);
  return notes;
};

const updateNote = async (noteId, userId, updateData) => {
  const updated = await Note.findOneAndUpdate(
    { _id: noteId, user: userId, isDeleted: false },
    updateData,
    { new: true }
  );
  if (!updated) {
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }
  logger.info(`Note updated: ${noteId} by user: ${userId}`);
  return updated;
};

const deleteNote = async (noteId, userId) => {
  // Soft delete
  const deleted = await Note.findOneAndUpdate(
    { _id: noteId, user: userId, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!deleted) {
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }
  logger.info(`Note soft-deleted: ${noteId} by user: ${userId}`);
  return { message: "Note moved to trash" };
};

const getTrashedNotes = async (userId) => {
  const notes = await Note.find({ user: userId, isDeleted: true }).sort({
    deletedAt: -1,
  });
  return notes;
};

const restoreNote = async (noteId, userId) => {
  const restored = await Note.findOneAndUpdate(
    { _id: noteId, user: userId, isDeleted: true },
    { isDeleted: false, deletedAt: null },
    { new: true }
  );
  if (!restored) {
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }
  logger.info(`Note restored: ${noteId} by user: ${userId}`);
  return restored;
};

const permanentlyDeleteNote = async (noteId, userId) => {
  const deleted = await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
    isDeleted: true,
  });
  if (!deleted) {
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }
  logger.info(`Note permanently deleted: ${noteId} by user: ${userId}`);
  return { message: "Note permanently deleted" };
};

const togglePin = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, user: userId, isDeleted: false });
  if (!note) {
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }
  note.isPinned = !note.isPinned;
  await note.save();
  logger.info(`Note pin toggled: ${noteId} by user: ${userId}`);
  return note;
};

const updateTags = async (noteId, userId, tags) => {
  const updated = await Note.findOneAndUpdate(
    { _id: noteId, user: userId, isDeleted: false },
    { tags },
    { new: true }
  );
  if (!updated) {
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }
  logger.info(`Tags updated: ${noteId} by user: ${userId}`);
  return updated;
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getTrashedNotes,
  restoreNote,
  permanentlyDeleteNote,
  togglePin,
  updateTags,
};