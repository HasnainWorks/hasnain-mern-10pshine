const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/notes", authMiddleware, notesController.createNote);
router.get("/notes", authMiddleware, notesController.getNotes);

// Trash — 
router.get("/notes/trash", authMiddleware, notesController.getTrashedNotes);

// /:id routes
router.put("/notes/:id", authMiddleware, notesController.updateNote);
router.delete("/notes/:id", authMiddleware, notesController.deleteNote);
router.patch("/notes/:id/restore", authMiddleware, notesController.restoreNote);
router.delete("/notes/:id/permanent", authMiddleware, notesController.permanentlyDeleteNote);
router.patch("/notes/:id/pin", authMiddleware, notesController.togglePin);
router.patch("/notes/:id/tags", authMiddleware, notesController.updateTags);

module.exports = router;