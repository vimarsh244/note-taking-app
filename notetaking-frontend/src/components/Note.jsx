import React, { useContext, useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { NotesContext } from '../App';
import { useParams } from 'react-router-dom';

import {MDXEditor, headingsPlugin} from '@mdxeditor/editor';


function Note() {
  const { notes, setNotes } = useContext(NotesContext);
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);
  const [title, setTitle] = useState(note ? note.title : "");

  useEffect(() => {
    setTitle(note ? note.title : "");
  }, [note]);

//   const handleEdit = (content) => {
//     const newNotes = notes.map((n) => (n.id === id ? { ...n, content } : n));
//     setNotes(newNotes);
//   };
// for the old MDEditor, use this:

    const handleEdit = (content) => {
        const newNotes = notes.map((n) => (n.id === id ? { ...n, content } : n));
        setNotes(newNotes);
    };

  const handleTitleChange = (e) => {
    setTitle(e.target.innerText);
    const newNotes = notes.map((n) => (n.id === id ? { ...n, title: e.target.innerText } : n));
    setNotes(newNotes);
  };

  if (!note) {
    return null;
  }

  return (
    <div>
        <h1 
  contentEditable={true} 
  suppressContentEditableWarning={true} 
  onBlur={handleTitleChange} 
  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
>
  {title}
</h1>

      <MDEditor value={note.content || ''} onChange={handleEdit} />



    </div>
  );
}

export default Note;