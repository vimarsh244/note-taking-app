import React, { useContext, useState, useEffect } from 'react';
import { NotesContext } from '../App';
import MDEditor from '@uiw/react-md-editor';


function NoteForm() {
    const { notes, setNotes, editMode, setEditMode, noteIndex, setNoteIndex } = useContext(NotesContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
  
    useEffect(() => {
      if (editMode) {
        setTitle(notes[noteIndex].title);
        setContent(notes[noteIndex].content);
      }
    }, [editMode]);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (editMode) {
        setNotes(notes.map((note, i) => i === noteIndex ? { title, content } : note));
        setEditMode(false);
        setNoteIndex(null);
      } else {
        setNotes((prevNotes) => [...prevNotes, { title, content }]);
      }
      setTitle('');
      setContent('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
        />
        <MDEditor
          value={content}
          onChange={setContent}
        />
        <button type="submit">{editMode ? 'Update note' : 'Add note'}</button>
      </form>
    );
  }
  
  export default NoteForm;