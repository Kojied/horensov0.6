const fs = require('fs');
const csv = require('csv-parser');
const knex = require('knex')(require('../knexfile').development); // Configure knexfile accordingly

function importCSV() {
  fs.createReadStream('../lessonsheet.csv')
    .pipe(csv())
    .on('data', async (row) => {
      try {
        await knex('lessons').insert({
          lesson_number: row.lesson_number,
          lesson_name: row.lesson_name,
          category: row.category,
          summary: row.summary,
          url: row.url
        });
      } catch (err) {
        console.error("Error inserting row:", err);
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

module.exports = { importCSV };