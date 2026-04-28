const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/ai/summarize", authMiddleware, aiController.summarize);
router.post("/ai/assist", authMiddleware, aiController.assist);
router.post("/ai/tags", authMiddleware, aiController.tags);

module.exports = router;