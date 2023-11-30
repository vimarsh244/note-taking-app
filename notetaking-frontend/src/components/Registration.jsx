import React, { useState } from 'react';
import axios from 'axios';


function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { username, password };
    try {
      await axios.post(import.meta.env.VITE_SERVER_URL + '/api/register', user);
      setUsername('');
      setPassword('');
      setRegistrationStatus('Registration Successful');
      
    } catch (error) {
      setRegistrationStatus('Registration Failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      {registrationStatus && <p>{registrationStatus}</p>}
    </div>
  );
}


export default Registration;