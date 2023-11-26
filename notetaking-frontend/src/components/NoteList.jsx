import React, { useContext, useEffect } from 'react';
import { NotesContext } from '../App';
import ReactMarkdown from 'react-markdown';
import sanitize from 'rehype-sanitize';

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
            <h2>{note.title}</h2>
            <ReactMarkdown rehypePlugins={[sanitize]}>{note.content}</ReactMarkdown>
            <button onClick={() => handleDelete(index)}>Delete note</button>
            <button onClick={() => handleEdit(index)}>Edit note</button>
          </li>
        ))}
      </ul>
    );
  }

export default NoteList;