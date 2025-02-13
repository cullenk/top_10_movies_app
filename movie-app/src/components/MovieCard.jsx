import React, { useState } from "react";
import Search from "./Search";
import MovieDetails from "./MovieDetails";

function MovieCard({ index }) {
  const [movie, setMovie] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSelectMovie = (selectedMovie) => {
    setMovie(selectedMovie);
    setIsSearching(false);
  };

  const handleRemoveMovie = (e) => {
    e.stopPropagation();
    setMovie(null);
  };

  const openMovieDetails = () => {
    if (movie) {
      setShowDetails(true);
    }
  };

  return (
    <>
      <div className="min-h-[450px] p-4 rounded-lg border-2 border-solid border-white text-white bg-gray-800 cursor-pointer hover:bg-gray-700 hover:scale-[1.02] transition-all duration-300 flex flex-col">
        {movie ? (
          <div
            className="relative flex flex-col h-full"
            onClick={openMovieDetails}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-lg"
            />
            <h3 className="mt-2 text-lg font-bold text-center">
              {movie.title}
            </h3>
            <p className="text-sm text-center text-slate-50/45">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <div
              onClick={handleRemoveMovie}
              className="absolute bottom-2 right-2 text-white cursor-pointer hover:text-red-500"
            >
              🗑️
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-100">
            {isSearching ? (
              <Search onSelectMovie={handleSelectMovie} />
            ) : (
              <button
                onClick={() => setIsSearching(true)}
                className="w-full h-100 text-4xl cursor-pointer flex items-center justify-center"
              >
                +
              </button>
            )}
          </div>
        )}
      </div>
      {showDetails && (
        <MovieDetails movie={movie} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}

export default MovieCard;
