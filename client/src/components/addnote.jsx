import React, { useContext, useState } from 'react';
import noteContext from '../context/noteContext';

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: '',
    description: '',
    tag: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (note.title.length < 3 || note.description.length < 5) {
      props.showAlert('Title should have at least 3 characters, and Description should have at least 5 characters', 'danger');
      return;
    }

    addNote(note.title, note.description, note.tag);
    props.showAlert('Note Added Successfully', 'success');
    setNote({
      title: '',
      description: '',
      tag: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
      <form className="my-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            aria-describedby="emailHelp"
            onChange={handleChange}
            value={note.title}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            type="text"
            className="form-control"
            id="description"
            name="description"
            onChange={handleChange}
            value={note.description}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            onChange={handleChange}
            value={note.tag}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={note.title.length < 3 || note.description.length < 5}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
