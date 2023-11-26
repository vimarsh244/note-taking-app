import React, { useContext, useState } from 'react';
import { NotesContext } from '../App';
import MDEditor from '@uiw/react-md-editor';

function NoteForm() {
    const { setNotes } = useContext(NotesContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      setNotes((prevNotes) => [...prevNotes, { title, content }]);
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
        <button type="submit">Add note</button>
      </form>
    );
  }
  
  export default NoteForm;