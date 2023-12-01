import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SearchBar() {
  const [results, setResults] = useState([]);

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;

      const authToken = localStorage.getItem("token");
      axios.get(`${import.meta.env.VITE_SERVER_URL}/api/notes/search?query=${query}`, { headers: { Authorization: `Bearer ${authToken}` } })
        .then(response => setResults(response.data))
        .catch(error => console.error(error));
    }
  };

  return (
    <div>
      <input type="search" onKeyDown={handleSearch} placeholder="Search notes..." />
      {results.map((result, index) => (
        <Link key={index} to={result}>{result}</Link>
      ))}
    </div>
  );
}

export default SearchBar;