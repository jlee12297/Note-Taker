const express = require('express');
const fs = require('fs');
const path = require('path');
const { clog } = require('./middleware/clog');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils')
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route to read to db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
  readFromFile(path.join(__dirname, "/db/db.json")).then((data) => res.json(JSON.parse(data)));
});

// POST Route to recieve a new note and add it to db.json, then return new note to the client
app.post('/api/notes', (req, res) => {
  console.log(req.body)
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      noteId: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json('Note added successfully!!!')
  } else {
    res.error('Error in adding note...')
  }
})

// GET Route to ensure even if "unknown" query parameter, then user is still brought to notetake index.html homepage
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '/public/index.html'))
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);