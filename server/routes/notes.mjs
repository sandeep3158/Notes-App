import express from 'express';
import { body, validationResult } from 'express-validator';
import fetchUser from '../middleware/fetchUser.mjs'; // Assuming the fetchUser middleware is defined in a file named "fetchUser.mjs"
import Notes from '../models/Notes.mjs'; // Assuming the Notes model is defined in a file named "Notes.mjs"

const router = express.Router();

// Route 1: Get all the notes from the user using GET '/api/notes/fetchallnotes' (Login required)
router.get('/fetchallnotes', fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    // console.log(notes);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: Add a new note using POST '/api/notes/addnotes' (Login required)
router.post(
  '/addnotes',
  fetchUser,
  [
    body('title', 'Title should contain at least 3 characters').isLength({ min: 3 }),
    body('description', 'Description must contain at least 10 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = await Notes.create({
        title,
        description,
        tag,
        user: req.user.id,
      });
      res.send({ note });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
);

// Route 3: Update a note using PUT '/api/notes/updatenote/:id' (Login required)
router.put('/updatenote/:id', fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Not found');
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route 4: Delete an existing Note using DELETE '/api/notes/deletenote/:id' (Login required)
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
  try {

    // Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Not found');
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted", note: note });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

export default router;
