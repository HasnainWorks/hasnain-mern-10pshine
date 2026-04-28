const Groq = require("groq-sdk");
const logger = require("../utils/logger");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const summarizeNote = async (title, content) => {
  const plainText = content.replace(/<[^>]*>/g, "").trim();

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes notes concisely. Return only the summary, no extra text, no preamble.",
      },
      {
        role: "user",
        content: `Summarize this note in 2-3 sentences:\n\nTitle: ${title}\n\n${plainText}`,
      },
    ],
    max_tokens: 200,
  });

  logger.info("AI summarize called");
  return response.choices[0].message.content.trim();
};

const assistWriting = async (title, content, action) => {
  const plainText = content.replace(/<[^>]*>/g, "").trim();

  const actions = {
    continue: "Continue writing this note naturally, adding 2-3 more sentences that flow from the existing content.",
    improve: "Improve the writing quality of this note. Make it clearer, more concise and professional. Return only the improved text.",
    grammar: "Fix any grammar and spelling mistakes in this note. Return only the corrected text.",
  };

  const instruction = actions[action] || actions.continue;

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: "You are a writing assistant. Return only the requested text with no extra explanation or preamble.",
      },
      {
        role: "user",
        content: `${instruction}\n\nTitle: ${title}\n\nContent: ${plainText}`,
      },
    ],
    max_tokens: 500,
  });

  logger.info(`AI writing assist called — action: ${action}`);
  return response.choices[0].message.content.trim();
};

const generateTags = async (title, content) => {
  const plainText = content.replace(/<[^>]*>/g, "").trim();

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: "You are a tagging assistant. Return only a JSON array of 3-5 lowercase tags, no explanation. Example: [\"work\", \"ideas\", \"project\"]",
      },
      {
        role: "user",
        content: `Generate relevant tags for this note:\n\nTitle: ${title}\n\n${plainText}`,
      },
    ],
    max_tokens: 100,
  });

  logger.info("AI tag generation called");
  const raw = response.choices[0].message.content.trim();

  try {
    const tags = JSON.parse(raw);
    return Array.isArray(tags) ? tags : [];
  } catch {
    // fallback — extract words that look like tags
    const matches = raw.match(/"([^"]+)"/g);
    return matches ? matches.map((t) => t.replace(/"/g, "")) : [];
  }
};

module.exports = { summarizeNote, assistWriting, generateTags };