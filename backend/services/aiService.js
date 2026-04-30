const Groq = require("groq-sdk");
const logger = require("../utils/logger");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const summarizeNote = async (title, content) => {
  const plainText = content.replace(/<[^>]*>/g, "").trim();

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes notes. Even if the note is short, provide a useful summary or expand on what it means. Never say the note is empty.",
      },
      {
        role: "user",
        content: `Summarize this note in 2-3 sentences:\n\nTitle: ${title || "Untitled"}\n\nContent: ${plainText || "(no content yet)"}`,
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
    continue:
      "Continue writing this note naturally, adding 2-3 more sentences that flow from the existing content. Even if content is short, expand on the idea. Return only the new sentences to append.",
    improve:
      "Improve the writing quality of this note. Make it clearer, more concise and professional. Return the improved title on the first line, then a blank line, then the improved body text.",
    grammar:
      "Fix any grammar and spelling mistakes in this note. Return the corrected title on the first line, then a blank line, then the corrected body text.",
  };

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a writing assistant. Always return useful output even for short notes. Never say the note is empty or too short.",
      },
      {
        role: "user",
        content: `${actions[action]}\n\nTitle: ${title || "Untitled"}\n\nContent: ${plainText || "(no content yet)"}`,
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
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a tagging assistant. Always return a JSON array of 3-5 lowercase tags based on the title and content. Even if content is short, generate relevant tags. Return only the JSON array, nothing else. Example: [\"work\", \"ideas\", \"project\"]",
      },
      {
        role: "user",
        content: `Generate tags for:\n\nTitle: ${title || "Untitled"}\n\nContent: ${plainText || "(no content yet)"}`,
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
    const matches = raw.match(/"([^"]+)"/g);
    return matches ? matches.map((t) => t.replace(/"/g, "")) : [];
  }
};

module.exports = { summarizeNote, assistWriting, generateTags };