const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// CREATE NOTE
router.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    logger.info(`Note created by user: ${req.user.id}`);

    res.status(201).json(note);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL NOTES (user-specific)
router.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });

    logger.info(`Notes fetched by user: ${req.user.id}`);

    res.json(notes);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE NOTE
router.put("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      logger.warn(
        `Update failed - not found or unauthorized: ${req.params.id}`
      );
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    logger.info(
      `Note updated: ${req.params.id} by user: ${req.user.id}`
    );

    res.json(updated);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE NOTE
router.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      logger.warn(
        `Delete failed - not found or unauthorized: ${req.params.id}`
      );
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    logger.info(
      `Note deleted: ${req.params.id} by user: ${req.user.id}`
    );

    res.json({ message: "Note deleted" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;