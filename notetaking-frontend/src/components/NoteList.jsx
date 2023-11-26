import React, { useContext } from 'react';
import { NotesContext } from '../App';

function NoteList() {
    const { notes, setNotes } = useContext(NotesContext);

    const handleDelete = (index) => {
        setNotes(notes.filter((note, i) => i !== index));
    };

    return (
        <ul>
            {notes.map((note, index) => (
                <li key={index}>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                    <button onClick={() => handleDelete(index)}>Delete note</button>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;