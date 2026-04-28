const aiService = require("../services/aiService");

const summarize = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      const error = new Error("Content is required");
      error.status = 400;
      throw error;
    }
    const summary = await aiService.summarizeNote(title, content);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

const assist = async (req, res, next) => {
  try {
    const { title, content, action } = req.body;
    if (!content) {
      const error = new Error("Content is required");
      error.status = 400;
      throw error;
    }
    if (!["continue", "improve", "grammar"].includes(action)) {
      const error = new Error("Invalid action. Use: continue, improve, grammar");
      error.status = 400;
      throw error;
    }
    const result = await aiService.assistWriting(title, content, action);
    res.json({ result });
  } catch (err) {
    next(err);
  }
};

const tags = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      const error = new Error("Content is required");
      error.status = 400;
      throw error;
    }
    const generatedTags = await aiService.generateTags(title, content);
    res.json({ tags: generatedTags });
  } catch (err) {
    next(err);
  }
};

module.exports = { summarize, assist, tags };