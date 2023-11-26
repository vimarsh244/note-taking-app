import React, { createContext, useState } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import Note from './components/Note';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const NotesContext = React.createContext();

function App() {
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [noteIndex, setNoteIndex] = useState(null);

  return (
    <NotesContext.Provider value={{ notes, setNotes, editMode, setEditMode, noteIndex, setNoteIndex }}>
      <Router>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <NoteForm />
            <NoteList />
          </div>
          <div style={{ flex: 2 }}>
            <Routes>
              <Route path="/:noteName" element={<Note />} />
            </Routes>
          </div>
        </div>
      </Router>
    </NotesContext.Provider>
  );
}

export default App;