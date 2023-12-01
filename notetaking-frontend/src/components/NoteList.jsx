import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { NotesContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

function NoteList() {
    const { notes, setNotes } = useContext(NotesContext);
    const navigate = useNavigate();
  
    const createNote = () => {
      const newNote = { id: uuidv4(), title: 'New Note', content: '' };
      setNotes([...notes, newNote]);
    };
  
    const deleteNote = (id) => {
      const newNotes = notes.filter((note) => note.id !== id);
      setNotes(newNotes);
      navigate('/'); // Navigate to home page after deleting a note
    };

  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>
          <Link to={`/${note.id}`}>
            <h2>{note.title}</h2>
            <p>{note.content.substring(0, 100)}</p>
          </Link>
          {/* <button onClick={() => deleteNote(note.id)}>Delete</button>  */} {/* not in mood to integrate delete note on two seperate components, can use api and things but nahhh */}
        </div>
      ))}
      <button onClick={createNote}>Create New Note</button>
    </div>
  );
}

export default NoteList;