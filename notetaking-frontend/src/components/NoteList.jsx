import React, { useContext } from 'react';
import { NotesContext } from '../App';
import { Link } from 'react-router-dom';

function NoteList() {
  const { notes, setNotes, setEditMode, setNoteIndex } = useContext(NotesContext);

  const handleDelete = (index) => {
    setNotes(notes.filter((note, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditMode(true);
    setNoteIndex(index);
  };

  return (
    <ul>
      {notes.map((note, index) => (
        <li key={index}>
          <Link to={`/${note.name}`}>{note.name}</Link>
          <button onClick={() => handleEdit(index)}>Edit</button>
          <button onClick={() => handleDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;