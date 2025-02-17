const knex = require('knex')(require('../knexfile').development);
const Fuse = require('fuse.js');
const { processQuery } = require('../services/geminiService');

exports.getAllLessons = async (req, res) => {
  try {
    let lessons = await knex('lessons').select('*');
    const { query } = req.query;

    if (query) {
      // Fuzzy search using Fuse.js
      const fuse = new Fuse(lessons, {
        keys: ['lesson_name', 'summary', 'category'],
        threshold: 0.3,
      });
      lessons = fuse.search(query).map(result => result.item);

      // Gemini integration (if API keys are available)
      if (process.env.GEMINI_API_KEY && process.env.OPENROUTER_API_KEY) {
        try {
          const geminiResults = await processQuery(query, lessons);
          // Merge Fuse.js results with Gemini-enhanced results as needed
          lessons = geminiResults; // Replace Fuse.js results with Gemini results for now
        } catch (error) {
          console.error("Gemini API error:", error);
          // Handle Gemini API error gracefully (e.g., log the error, return a default response)
        }
      }
    }

    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving lessons' });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await knex('lessons').where({ id: req.params.id }).first();
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving lesson' });
  }
};