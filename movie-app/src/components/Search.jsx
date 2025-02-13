import React, { useState, useEffect } from 'react';
import useDebounce from '../custom-hooks/useDebounce';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Search({ onSelectMovie }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Debounced query value
  const debouncedQuery = useDebounce(query, 500); // Wait for 500ms after typing stops

  // Fetch movies when the debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${debouncedQuery}&page=1&include_adult=false`)
        .then(response => response.json())
        .then(data => setResults(data.results));
    } else {
      setResults([]); // Clear results if query is empty
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 text-white rounded border-2 border-solid border-white"
        placeholder="Search for a movie"
      />
      {results.length > 0 && (
        <ul className="mb-2 max-h-40 overflow-y-auto">
          {results.map(movie => (
            <li
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="cursor-pointer hover:bg-gray-700 p-2"
            >
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
