const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessons');

router.get('/', lessonsController.getAllLessons);
router.get('/:id', lessonsController.getLessonById);

module.exports = router;