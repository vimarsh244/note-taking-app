import React, { useContext, useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { NotesContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";

import { MDXEditor, headingsPlugin } from "@mdxeditor/editor";

function Note() {
  const { notes, setNotes } = useContext(NotesContext);
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);
  const [title, setTitle] = useState(note ? note.title : "");

  useEffect(() => {
    setTitle(note ? note.title : "");
  }, [note]);

  const handleEdit = (content) => {
    const updatedNote = { ...note, content };
    const newNotes = notes.map((n) => (n.id === id ? updatedNote : n));
    setNotes(newNotes);
    backupNotes(updatedNote); // Backup the updated note
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.innerText);
    const updatedNote = { ...note, title: e.target.innerText };
    const newNotes = notes.map((n) => (n.id === id ? updatedNote : n));
    setNotes(newNotes);
    backupNotes(updatedNote); // Backup the updated note
  };

  const backupNotes = async (note) => {
    try {
      console.log(note);
      const authToken = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/notes/${note.id}`,
        {
          title: note.title,
          content: note.content,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (error) {
      console.error("Error during note backup:", error);
    }
  };
  const deleteNote = async () => {
    try {
      const authToken = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const newNotes = notes.filter((n) => n.id !== id);
      setNotes(newNotes);
      // Remove the note from the backend
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/notes/${id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (error) {
      console.error("Error during note deletion:", error);
    }
  };

  // const deleteNote = async () => {
  //   try {
  //     const authToken = localStorage.getItem("token");
  //     await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/notes/${id}`, {
  //       headers: { Authorization: `Bearer ${authToken}` },
  //     });
  //     const newNotes = notes.filter((n) => n.id !== id);
  //     setNotes(newNotes);
  //   } catch (error) {
  //     console.error("Error during note deletion:", error);
  //   }
  // };

  if (!note) {
    return null;
  }

  return (
    <div>
      <h1
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleTitleChange}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      >
        {title}
      </h1>

      <MDEditor value={note.content || ""} onChange={handleEdit} />

      <button onClick={deleteNote}>Delete Note</button>
    </div>
  );
}

export default Note;
