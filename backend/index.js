require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const lessonsRouter = require('./routes/lessons');

app.use(cors());
app.use(express.json());

app.use('/lessons', lessonsRouter);

// Define a simple test route
app.get('/', (req, res) => {
  res.send("Hello, TalentLMS!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});