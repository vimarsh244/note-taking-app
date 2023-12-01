import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function NavBar() {
    

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ marginLeft: '0' }}>Notes App</h1>
            <SearchBar />
        </nav>
    );
}

export default NavBar;