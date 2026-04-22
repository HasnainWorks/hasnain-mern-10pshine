const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/notes", authMiddleware, notesController.createNote);
router.get("/notes", authMiddleware, notesController.getNotes);
router.put("/notes/:id", authMiddleware, notesController.updateNote);
router.delete("/notes/:id", authMiddleware, notesController.deleteNote);

module.exports = router;