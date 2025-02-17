exports.getLessons = (req, res) => {
  res.send('Get lessons endpoint');
};

const { generatePdf } = require('../utils/pdfGenerator');

exports.getLessons = (req, res) => {
  res.send('Get lessons endpoint');
};

exports.getLesson = (req, res) => {
  res.send('Get lesson endpoint');
};

exports.getLessonPdf = async (req, res) => {
  const lessonId = req.params.id;
  try {
    const pdf = await generatePdf(`Lesson ${lessonId} Details`);
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }
};