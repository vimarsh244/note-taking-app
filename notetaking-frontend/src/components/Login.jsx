import React, { useState } from 'react';
import axios from 'axios';
import { fetchNotes } from './FetchAllNotesandUpdates';
// import './FetchAllNotesandUpdates';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { username, password };
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/login`, user);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('logged_in', true);
    setUsername('');
    setPassword('');
    setLoginSuccess(true);
    const token_temp = response.data.token;
    const response2 = fetchNotes(token_temp);
    // FetchAllNotesandUpdates.fetchNotes();
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  };

  
  return (
    <div>
      {loginSuccess && <p>Login successful!</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
