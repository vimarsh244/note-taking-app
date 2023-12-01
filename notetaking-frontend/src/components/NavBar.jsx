import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('logged_in');
        localStorage.removeItem('token');
        localStorage.removeItem('notes');
        navigate('/');
        setTimeout(() => {
            window.location.reload();
          }, 500);
    };

    const isLoggedIn = localStorage.getItem('logged_in') === 'true';

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ marginLeft: '0' }}>Notes App</h1>
            {isLoggedIn && <SearchBar />}
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
}

export default NavBar;