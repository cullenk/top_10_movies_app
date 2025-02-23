import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchMoviesQuery } from '../store/moviesApiSlice';
import useDebounce from '../custom-hooks/useDebounce';

function Search({ onSelectMovie }) {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  // Debounced query value
  const debouncedQuery = useDebounce(query, 500); // Wait for 500ms after typing stops

  const { data: results, isLoading, error } = useSearchMoviesQuery(debouncedQuery, {
    skip: !debouncedQuery,
  });

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
      {error && <p className="text-red-500">An error occurred while fetching movies. Please try again.</p>}
      {results && results.length > 0 && (
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
