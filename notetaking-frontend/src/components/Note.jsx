import React, { useContext } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { NotesContext } from '../App';
import { useParams } from 'react-router-dom';

function Note() {
  const { notes, setNotes } = useContext(NotesContext);
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);

  const handleEdit = (content) => {
    const newNotes = notes.map((n) => (n.id === id ? { ...n, content } : n));
    setNotes(newNotes);
  };

  if (!note) {
    return null;
  }

  return (
    <div>
      <h2>{note.title}</h2>
      <MDEditor value={note.content || ''} onChange={handleEdit} />
    </div>
  );
}

export default Note;