import React, { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function MovieDetails({ movie, onClose }) {
  const [movieInfo, setMovieInfo] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [certification, setCertification] = useState(null);

  useEffect(() => {
    if (movie) {
      // Fetch additional movie details
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Movie Details:", data); // Log the full movie details object
          setMovieInfo(data);
        });

      // Fetch trailer data
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Trailer Data:", data); // Log the trailer data object
          const trailer = data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (trailer) setTrailerKey(trailer.key);
        });

      // Fetch certification (MPAA rating)
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Certification Data:", data); // Log the certification data object
          const usRelease = data.results.find(
            (entry) => entry.iso_3166_1 === "US"
          );
          if (usRelease && usRelease.release_dates.length > 0) {
            const usCertification = usRelease.release_dates[0].certification;
            setCertification(usCertification || "Not Rated");
          }
        });
    }
  }, [movie]);

  if (!movie) return null;

  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="fixed inset-0 bg-gray-950/90 flex items-center justify-center z-50">
      <div
        className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 flex flex-col overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start w-full">
          <h2 className="text-3xl text-white text-left font-bold mb-4">
            {movie.title}
          </h2>
          <div className="flex text-white rounded p-2">
            <img src="star.svg" alt="Star" />
            <p className="mx-2">{movie.vote_average.toFixed(1)}/10</p>
          </div>
        </div>

        {/* Movie Info */}
        <div className="text-white flex flex-wrap mb-4">
          <p className="mr-2 mb-2 text-gray-100">
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          {certification && (
            <>
              <p className="mr-2 mb-2 text-gray-100">·</p>
              <p className="mr-2 mb-2 text-gray-100">{certification}</p>
            </>
          )}
          {movieInfo && (
            <>
              <p className="mr-2 mb-2 text-gray-100">·</p>
              <p className="mr-2 mb-2 text-gray-100">{`${movieInfo.runtime} mins`}</p>
            </>
          )}
        </div>

        {/* Poster and Backdrop Image */}
        <div className="flex flex-col md:flex-row mb-4 items-stretch gap-2">
          {/* Poster */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img
              src={`${BASE_IMAGE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="ml-4">
            {movieInfo && (
              <>
                {/* Genres */}
                {movieInfo.genres.length > 0 && (
                  <div className="mr-2 mb-2 text-gray-100 flex items-start md:items-center">
                    <span className="text-gradient font-bold mr-2">
                      Genres:{" "}
                    </span>
                    <div className="flex flex-wrap items-center mt-1">
                      {movieInfo.genres.map((genre) => (
                        <div
                          key={genre.id}
                          className="text-white bg-amber-50/25 rounded px-2 mr-2"
                        >
                          {genre.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget */}
                <p className="mr-2 mb-2 text-gray-100">
                  <span className="text-gradient font-bold mr-2">Budget: </span>
                  ${movieInfo.budget.toLocaleString()}
                </p>

                {/* Box Office */}
                <p className="mr-2 mb-2 text-gray-100">
                  <span className="text-gradient font-bold mr-2">
                    Box Office:{" "}
                  </span>
                  ${movieInfo.revenue.toLocaleString()}
                </p>

                {/* Tagline */}
                <p className="mr-2 mb-2 text-gray-100">
                  <span className="text-gradient font-bold mr-2">
                    Tagline:{" "}
                  </span>
                  {movieInfo.tagline || "No tagline available"}
                </p>

                {/* Production Companies */}
                {movieInfo.production_companies.length > 0 && (
                  <div className="mr-2 mb-4 text-gray-100">
                    <span className="text-gradient font-bold mr-2">
                      Production:{" "}
                    </span>
                    <div className="mt-1">
                      {movieInfo.production_companies.map((production) => (
                        <div
                          key={production.id}
                          className="flex items-center mr-4 mb-2"
                        >
                          {production.logo_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w200${production.logo_path}`}
                              alt={`${production.name} logo`}
                              className="h-6 w-auto mr-2 bg-amber-50 rounded p-0.5"
                            />
                          )}
                          <p>{production.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Overview */}
            <div className="my-2">
              <p className="mb-4 text-white">{movie.overview}</p>
            </div>
          </div>
        </div>

        {/* Backdrop and Trailer */}
        {(movie.backdrop_path || trailerKey) && (
          <div className="mb-4">
            {movie.backdrop_path && (
              <div className="w-full flex-grow mb-4">
                <div
                  className="w-full h-0 pb-[56.25%] bg-cover bg-center rounded-lg relative"
                  style={{
                    backgroundImage: `url(${BASE_IMAGE_URL}${movie.backdrop_path})`,
                  }}
                ></div>
              </div>
            )}

            {trailerKey && (
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="self-end cursor-pointer mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default MovieDetails;
