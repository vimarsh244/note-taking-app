import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteList from './components/NoteList';
import Note from './components/Note';

import './App.css'; // Import the CSS file

// Create a context to share notes state across components
export const NotesContext = createContext();

function App() {
  
  // State for notes
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      return JSON.parse(savedNotes);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      <Router>
        <div className="App">
          <div className="NoteList">
            <NoteList />
          </div>
          <div className="Note">
            <Routes>
              <Route path="/:id" element={<Note />} />
            </Routes>
          </div>
        </div>
      </Router>
    </NotesContext.Provider>
  );
}

export default App;