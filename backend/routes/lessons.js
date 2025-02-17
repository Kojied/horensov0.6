const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessons');

router.get('/', lessonsController.getLessons);
router.get('/:id', lessonsController.getLesson);
router.get('/:id/pdf', lessonsController.getLessonPdf);

module.exports = router;