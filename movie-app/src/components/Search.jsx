import React, { useState, useEffect } from 'react';
import useDebounce from '../custom-hooks/useDebounce';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Search({ onSelectMovie }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced query value
  const debouncedQuery = useDebounce(query, 500); // Wait for 500ms after typing stops

  // Fetch movies when the debounced query changes
  useEffect(() => {
    const fetchMovies = async () => {
      if (debouncedQuery) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${debouncedQuery}&page=1&include_adult=false`);
          if (!response.ok) {
            throw new Error('Failed to fetch movies');
          }
          const data = await response.json();
          setResults(data.results);
        } catch (err) {
          setError('An error occurred while fetching movies. Please try again.');
          console.error('Error fetching movies:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]); // Clear results if query is empty
      }
    };

    fetchMovies();
  }, [debouncedQuery]);

  const handleSelectMovie = (movie) => {
    onSelectMovie({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      overview: movie.overview,
      vote_average: movie.vote_average
    });
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 text-white bg-gray-700 rounded border-2 border-solid border-white"
        placeholder="Search for a movie"
      />
      {isLoading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && (
        <ul className="mt-2 max-h-40 overflow-y-auto bg-gray-800 rounded">
          {results.map(movie => (
            <li
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className="cursor-pointer hover:bg-gray-700 p-2 text-white"
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
