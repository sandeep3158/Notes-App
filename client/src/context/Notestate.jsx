import React, { useState } from "react";
import NoteContext from "./noteContext";
import { v4 as uuidv4 } from "uuid"; 
const host = "https://noteapp-chdv.onrender.com";
const authToken = localStorage.getItem('token');
const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken,
        }
      });
      const json =  await response.json();
      setNotes(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag })
      })
      const note = {
        _id: uuidv4(),
        "title": title,
        "description": description,
        "tag": tag,
      };
      setNotes([...notes, note]);
    } catch (error) {
      console.error("Error adding a note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "auth-token":authToken,
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
      await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag })
      });

      setNotes((prevNotes) => {
        return prevNotes.map((note) => {
          if (note._id === id) {
            return { ...note, title, description, tag };
          } else {
            return note;
          }
        });
      });
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
