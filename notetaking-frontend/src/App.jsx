import React, { createContext, useState } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
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