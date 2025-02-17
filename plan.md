# Project Plan: TalentLMS Search App with Gemini 2.0 Integration

This document outlines a step-by-step plan for building the TalentLMS search application. The project will ingest a CSV file (`lessonsheet.csv`), integrate Gemini 2.0 via OpenRouter (using API keys stored in `API.md`), and provide advanced search, copy, and PDF download functionality. We will use Git for version control and push all changes to the repository at [https://github.com/Kojied/horensov0.6.git](https://github.com/Kojied/horensov0.6.git).

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Environment and API Keys](#environment-and-api-keys)
3. [Milestone 1: Initial Project Structure](#milestone-1-initial-project-structure)
4. [Milestone 2: CSV Ingestion and Data Storage](#milestone-2-csv-ingestion-and-data-storage)
5. [Milestone 3: Backend API & Gemini 2.0 Integration](#milestone-3-backend-api--gemini-20-integration)
6. [Milestone 4: Frontend Development and Search UI](#milestone-4-frontend-development-and-search-ui)
7. [Milestone 5: Copy Functionality and PDF Generation](#milestone-5-copy-functionality-and-pdf-generation)
8. [GitHub Workflow & Branch Management](#github-workflow--branch-management)
9. [Common Issues and Resolutions](#common-issues-and-resolutions)
10. [Next Steps and Future Enhancements](#next-steps-and-future-enhancements)

---

## Project Setup

1. **Initialize the project directory:**
   - Create a new folder (e.g., `horensov0.6`).
   - Place the provided `lessonsheet.csv` and `API.md` in the project root.
   - Initialize a Git repository:
     ```bash
     git init
     git remote add origin https://github.com/Kojied/horensov0.6.git
     ```

2. **Choose the tech stack:**
   - **Backend:** Node.js with Express.
   - **Frontend:** React.
   - **Database:** For this small dataset, use SQLite (or PostgreSQL if scaling is needed later).
   - **Search:** For fuzzy search, use Fuse.js.
   - **PDF Generation:** Use PDFKit (server-side) or jsPDF (client-side).
   - **Gemini Integration:** Call Gemini 2.0 API via OpenRouter.

3. **Set up the project structure:**
   - Suggested folder structure:
     ```
     /horensov0.6
       |-- /backend
             |-- index.js
             |-- /routes
             |-- /controllers
             |-- /services
                   |-- geminiService.js
             |-- /models
             |-- /utils
                   |-- csvImporter.js
                   |-- pdfGenerator.js
             |-- .env
             |-- package.json
       |-- /frontend
             |-- /src
                   |-- App.js
                   |-- /components
                         |-- SearchBar.js
                         |-- LessonList.js
                         |-- LessonDetail.js
                         |-- CopyButton.js
                         |-- PdfDownloadButton.js
                   |-- index.js
             |-- package.json
       |-- lessonsheet.csv
       |-- API.md
       |-- plan.md  <-- (this file)
       |-- README.md
     ```

4. **Initial Git commit:**
   - Add the initial project structure and commit:
     ```bash
     git add .
     git commit -m "Initial project structure setup"
     git push -u origin master
     ```

---

## Environment and API Keys

1. **Managing API Keys Securely:**
   - Create a `.env` file in the `/backend` folder.
   - In `.env`, add:
     ```
     GEMINI_API_KEY=<your_gemini_api_key_here>
     OPENROUTER_API_KEY=<your_openrouter_api_key_here>
     DATABASE_URL=<your_database_connection_string>
     PORT=3000
     ```
   - **Note:** Extract these keys from `API.md` as needed. Make sure to add `.env` to `.gitignore` to avoid pushing sensitive data.

2. **Potential Issue:**  
   - *Issue:* API keys accidentally pushed to GitHub.  
     *Resolution:* Verify that `.env` is in `.gitignore` and check the repository history if needed.

---

## Milestone 1: Initial Project Structure

1. **Backend Setup:**
   - Initialize Node.js in the `/backend` folder:
     ```bash
     cd backend
     npm init -y
     npm install express dotenv sqlite3 knex cors axios csv-parser
     ```
   - Create a basic Express server in `index.js` that loads environment variables:
     ```javascript
     require('dotenv').config();
     const express = require('express');
     const cors = require('cors');
     const app = express();
     const PORT = process.env.PORT || 3000;

     app.use(cors());
     app.use(express.json());

     // Define a simple test route
     app.get('/', (req, res) => {
       res.send("Hello, TalentLMS!");
     });

     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });
     ```

2. **Frontend Setup:**
   - In the `/frontend` folder, initialize a React app (e.g., using Create React App):
     ```bash
     npx create-react-app .
     npm install axios
     ```
   - In `src/App.js`, set up a basic component that displays "Hello, TalentLMS!".

3. **Git Commit:**
   - Push the changes with a commit message: "Milestone 1: Initial Backend & Frontend Setup".

---

## Milestone 2: CSV Ingestion and Data Storage

1. **CSV Import Script:**
   - In `/backend/utils/csvImporter.js`, create a script to read `lessonsheet.csv` and insert records into the database using the `csv-parser` module.
   - Example code snippet:
     ```javascript
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
     ```
   - **Potential Issue:**  
     - *Issue:* CSV formatting errors (wrong delimiter or encoding).  
       *Resolution:* Manually validate the CSV and include error logging in the script.

2. **Database Setup:**
   - Set up SQLite using Knex or your chosen ORM.
   - Create a migration file to define the `lessons` table with appropriate fields.

3. **Testing the CSV Import:**
   - Run the CSV importer script and check that records are inserted properly.
   - Log any errors to help troubleshoot.

4. **Git Commit:**
   - Push the changes with a commit message: "Milestone 2: CSV Ingestion and Database Setup".

---

## Milestone 3: Backend API & Gemini 2.0 Integration

1. **Build REST Endpoints:**
   - In `/backend/routes`, create endpoints like:
     - `GET /lessons` – Returns the list of lessons (supports query parameters for search).
     - `GET /lessons/:id` – Returns details for a specific lesson.
   - In `/backend/controllers`, write corresponding functions.

2. **Gemini 2.0 Integration Module:**
   - In `/backend/services/geminiService.js`, implement functions that:
     - Read relevant lesson data from the database.
     - Use Axios to send a POST request to the Gemini 2.0 API via OpenRouter, including the CSV content or selected lessons in the context.
     - Process and return the highlighted and ranked search results.
   - Example snippet:
     ```javascript
     const axios = require('axios');
     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
     const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

     async function processQuery(query, lessonsContext) {
       try {
         const response = await axios.post('https://api.openrouter.io/v1/gemini/query', {
           query,
           context: lessonsContext
         }, {
           headers: {
             'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
             'Content-Type': 'application/json'
           }
         });
         return response.data;
       } catch (error) {
         console.error("Gemini API error:", error);
         throw error;
       }
     }

     module.exports = { processQuery };
     ```
   - **Potential Issue:**  
     - *Issue:* Handling API rate limits or unexpected errors from Gemini.  
       *Resolution:* Implement retry logic and detailed error logging.

3. **Integrate Fuzzy Search:**
   - Use Fuse.js on the backend (or frontend) to handle fuzzy search on the lessons.
   - Merge Fuse.js results with Gemini-enhanced results as needed.

4. **Testing:**
   - Use Postman to test endpoints and ensure Gemini API calls work correctly with sample queries.

5. **Git Commit:**
   - Push the changes with a commit message: "Milestone 3: Backend API and Gemini 2.0 Integration".

---

## Milestone 4: Frontend Development and Search UI

1. **Create Search Components:**
   - **SearchBar.js:** An input field component for user queries.
   - **LessonList.js:** A component to display a list of lessons, including search result highlights.
   - **LessonDetail.js:** A component to show detailed lesson summaries when toggled.

2. **Integrate with Backend:**
   - Use Axios in React to fetch data from the backend endpoints.
   - Handle loading states and error messages.
   - **Potential Issue:**  
     - *Issue:* CORS issues when the frontend calls the backend.  
       *Resolution:* Ensure that the Express server uses the `cors` middleware and is configured correctly.

3. **UI Enhancements:**
   - Add buttons for toggling summaries.
   - Implement individual and global copy buttons.
   - **Potential Issue:**  
     - *Issue:* Ensuring responsive design across devices.  
       *Resolution:* Test UI on different screen sizes and adjust CSS as needed.

4. **Git Commit:**
   - Push the changes with a commit message: "Milestone 4: Frontend Search UI and Integration".

---

## Milestone 5: Copy Functionality and PDF Generation

1. **Implement Copy Feature:**
   - In `CopyButton.js`, add a button that uses `navigator.clipboard.writeText()` to copy lesson details.
   - **Potential Issue:**  
     - *Issue:* Browser compatibility for the Clipboard API.  
       *Resolution:* Provide a fallback (e.g., temporary textarea creation and selection).

2. **PDF Generation Module:**
   - In `/backend/utils/pdfGenerator.js`, implement a function using PDFKit to generate a PDF.
   - Create an endpoint (`GET /lessons/pdf`) that triggers PDF generation and sends the file to the client.
   - **Potential Issue:**  
     - *Issue:* PDF layout and formatting issues.  
       *Resolution:* Test with sample data and tweak layout settings until the document is well-formatted.

3. **Testing:**
   - Verify copy functionality across different browsers.
   - Test the PDF endpoint using Postman and via the frontend download button.

4. **Git Commit:**
   - Push the changes with a commit message: "Milestone 5: Copy Feature and PDF Generation".

---

## GitHub Workflow & Branch Management

1. **Branch Strategy:**
   - Start on the `master` branch for the initial commit.
   - For each major milestone/feature, create a branch (e.g., `feature/csv-ingestion`, `feature/gemini-integration`, `feature/frontend-ui`, `feature/pdf-generation`).
   - Merge each branch into master once the feature is complete and tested.
   - Push each merge to the remote repository.

2. **Files to Commit:**
   - All source files in `/backend` and `/frontend` (excluding sensitive files like `.env`).
   - The CSV file (`lessonsheet.csv`), project configuration files (`package.json`, etc.).
   - Documentation files including `plan.md` and `README.md`.

---

## Common Issues and Resolutions

1. **API Key Issues:**
   - *Issue:* API keys not loaded properly.
   - *Resolution:* Ensure `dotenv` is configured at the very top of your `index.js` file with `require('dotenv').config()`.

2. **CSV Parsing Errors:**
   - *Issue:* CSV file not formatted correctly.
   - *Resolution:* Validate the CSV manually and add try/catch blocks with logging in `csvImporter.js`.

3. **Gemini API Errors:**
   - *Issue:* Gemini API rate limiting or unexpected errors.
   - *Resolution:* Add retry logic, proper error handling, and logging in `geminiService.js`.

4. **CORS Issues:**
   - *Issue:* Frontend requests being blocked.
   - *Resolution:* Use the `cors` middleware in Express and configure it appropriately.

5. **Git Merge Conflicts:**
   - *Issue:* Conflicts when merging branches.
   - *Resolution:* Use small, frequent commits and coordinate with team members when merging features.

---

## Next Steps and Future Enhancements

- **Internationalization:**  
  - Prepare the codebase for future support of Japanese lesson content and Spanish URLs.

- **Improved Search Ranking:**  
  - Continue refining Gemini 2.0 integration for better handling of synonyms and fuzzy matching.

- **User Authentication:**  
  - Consider adding user authentication if the application expands beyond internal use.

- **Continuous Integration (CI):**  
  - Set up a CI/CD pipeline (using GitHub Actions) to run tests on every push.

---

*This plan is designed as a detailed guide for a junior engineer. Follow each step carefully, and use the troubleshooting tips provided to resolve issues during development. Remember to frequently commit and push changes to GitHub for version control and rollback if necessary.*

Happy coding!
