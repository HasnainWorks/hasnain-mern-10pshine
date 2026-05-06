const Note = require("../models/Note");
const logger = require("../utils/logger");
const sanitizeHtml = require("sanitize-html");

const sanitizeOptions = {
  allowedTags: [
    "p", "br", "strong", "em", "s", "code", "pre",
    "h1", "h2", "h3", "ul", "ol", "li", "blockquote",
  ],
  allowedAttributes: {},
};

const createNote = async (title, content, userId, tags = []) => {
  if (!title) {
    const error = new Error("Title is required");
    error.status = 400;
    throw error;
  }
  if (title.length > 200) {
    const error = new Error("Title cannot exceed 200 characters");
    error.status = 400;
    throw error;
  }
  if (content && content.length > 50000) {
    const error = new Error("Content cannot exceed 50000 characters");
    error.status = 400;
    throw error;
  }
  if (tags.length > 10) {
    const error = new Error("Cannot have more than 10 tags");
    error.status = 400;
    throw error;
  }
  const cleanContent = sanitizeHtml(content || "", sanitizeOptions);
  const note = await Note.create({ title, content: cleanContent, user: userId, tags });
  logger.info(`Note created by user: ${userId}`);
  return note;
};

const getNotes = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const notes = await Note.find({ user: userId, isDeleted: false })
    .sort({ isPinned: -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Note.countDocuments({ user: userId, isDeleted: false });
  logger.info(`Notes fetched by user: ${userId}`);
  return {
    notes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
};

const updateNote = async (noteId, userId, updateData) => {
  if (updateData.content) {
    updateData.content = sanitizeHtml(updateData.content, sanitizeOptions);
  }
  if (updateData.title && updateData.title.length > 200) {
    const error = new Error("Title cannot exceed 200 characters");
    error.status = 400;
    throw error;
  }
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
  const note = await Note.findOne({
    _id: noteId,
    user: userId,
    isDeleted: false,
  });
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
  if (tags.length > 10) {
    const error = new Error("Cannot have more than 10 tags");
    error.status = 400;
    throw error;
  }
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