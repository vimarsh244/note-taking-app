import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { NotesContext } from '../App';
import ReactMarkdown from 'react-markdown';
import sanitize from 'rehype-sanitize';

function Note() {
  const { noteName } = useParams();
  const { notes } = useContext(NotesContext);
  const note = notes.find(note => note.name === noteName);

  if (!note) {
    return <p>Note not found</p>;
  }

  return (
    <div>
      <h1>{note.name}</h1>
      <ReactMarkdown children={note.content} rehypePlugins={[sanitize]} />
    </div>
  );
}

export default Note;