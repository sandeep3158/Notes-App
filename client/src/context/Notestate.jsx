import axios from 'axios';
import React, { useState } from "react";
import NoteContext from "./noteContext";
const host = 'https://noteapp-chdv.onrender.com';

const authToken = localStorage.getItem('token');

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  const getNotes = async () => {
    try {
      const response = await axios.get(`${host}/api/notes/fetchallnotes`, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        }
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async (title, description, tag) => {
    try {
      const response = await axios.post(`${host}/api/notes/addnotes`, {
        title,
        description,
        tag,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
      });
    
      setNotes([...notes, await response.data]);
    } catch (error) {
      console.error("Error adding a note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${host}/api/notes/deletenote/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken,
        }
      });
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error("Error deleting a note:", error);
    }
  };

  const editNote = async (id, title, description, tag) => {
    try {
      await axios.put(
        `${host}/api/notes/updatenote/${id}`,
        { 
          title,
          description,
          tag
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
        }
      );
  
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id
            ? { ...note, title, description, tag }
            : note
        )
      );
    } catch (error) {
      console.error("Error editing a note:", error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
