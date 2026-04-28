const notesService = require("../services/notesService");

const createNote = async (req, res, next) => {
  try {
   const { title, content, tags } = req.body;
   const note = await notesService.createNote(title, content, req.user.id, tags);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await notesService.getNotes(req.user.id);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await notesService.updateNote(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(note);
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const result = await notesService.deleteNote(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getTrashedNotes = async (req, res, next) => {
  try {
    const notes = await notesService.getTrashedNotes(req.user.id);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

const restoreNote = async (req, res, next) => {
  try {
    const note = await notesService.restoreNote(req.params.id, req.user.id);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

const permanentlyDeleteNote = async (req, res, next) => {
  try {
    const result = await notesService.permanentlyDeleteNote(
      req.params.id,
      req.user.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const togglePin = async (req, res, next) => {
  try {
    const note = await notesService.togglePin(req.params.id, req.user.id);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

const updateTags = async (req, res, next) => {
  try {
    const { tags } = req.body;
    const note = await notesService.updateTags(
      req.params.id,
      req.user.id,
      tags
    );
    res.json(note);
  } catch (err) {
    next(err);
  }
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