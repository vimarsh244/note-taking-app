import React, { createContext, useState } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [noteIndex, setNoteIndex] = useState(null);

  return (
    <NotesContext.Provider value={{ notes, setNotes, editMode, setEditMode, noteIndex, setNoteIndex }}>
      {children}
    </NotesContext.Provider>
  );
}

function App() {
  return (
    <NotesProvider>
      <NoteList />
      <NoteForm />
    </NotesProvider>
  );
}

export default App;