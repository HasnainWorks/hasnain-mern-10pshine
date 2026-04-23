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
  const notes = await Note.find({ user: userId });
  logger.info(`Notes fetched by user: ${userId}`);
  return notes;
};

const updateNote = async (noteId, userId, updateData) => {
  const updated = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    updateData,
    { new: true }
  );

  if (!updated) {
    logger.warn(`Update failed - not found or unauthorized: ${noteId}`);
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }

  logger.info(`Note updated: ${noteId} by user: ${userId}`);
  return updated;
};

const deleteNote = async (noteId, userId) => {
  const deleted = await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  });

  if (!deleted) {
    logger.warn(`Delete failed - not found or unauthorized: ${noteId}`);
    const error = new Error("Note not found or not authorized");
    error.status = 404;
    throw error;
  }

  logger.info(`Note deleted: ${noteId} by user: ${userId}`);
  return { message: "Note deleted" };
};

module.exports = { createNote, getNotes, updateNote, deleteNote };