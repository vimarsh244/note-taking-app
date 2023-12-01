import React from 'react';
import SearchBar from './SearchBar';
import { Link, useNavigate } from 'react-router-dom';

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
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 style={{ marginLeft: '0' }}>Notes App</h1>
            </Link>
            {isLoggedIn && <SearchBar />}
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
}

export default NavBar;