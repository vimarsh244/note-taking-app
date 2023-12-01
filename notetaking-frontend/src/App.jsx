import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoteList from "./components/NoteList";
import Note from "./components/Note";
import Login from "./components/Login";
import Registration from "./components/Registration";
import NavBar from "./components/NavBar";

import { fetchNotes } from './components/FetchAllNotesandUpdates';


import "./App.css"; // Import the CSS file

import "@mdxeditor/editor/style.css";

// importing the editor and the plugin from their full paths
import { MDXEditor } from "@mdxeditor/editor/MDXEditor";
import { headingsPlugin } from "@mdxeditor/editor/plugins/headings";

// Create a context to share notes state across components
export const NotesContext = createContext();

function App() {
  // State for notes
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // State for logged in status
  const [loggedIn, setLoggedIn] = useState(() => {
    const isLoggedIn = localStorage.getItem("logged_in");
    return isLoggedIn === "true";
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("logged_in");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  function updateFromServer() {
    const token_temp = localStorage.getItem('token');
    const response2 = fetchNotes(token_temp);
    // FetchAllNotesandUpdates.fetchNotes();
  }

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      <Router>
        <NavBar />
        {loggedIn ? (
          <div className="App">
            <div className="NoteList">
              <NoteList />
              <button onClick={updateFromServer}>Update from server</button>
            </div>
            <div className="Note">
              <Routes>
                <Route path="/:id" element={<Note />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div>
            <Login />
            <Registration />
          </div>
        )}
      </Router>
    </NotesContext.Provider>
  );
}

export default App;
