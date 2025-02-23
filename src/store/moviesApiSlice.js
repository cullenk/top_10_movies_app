import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const moviesApiSlice = createApi({
    reducerPath: 'moviesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
    endpoints: (builder) => ({
        getMovieDetails: builder.query({
            query: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
        }),
        getMovieVideos: builder.query({
            query: (movieId) => `/movie/${movieId}/videos?api_key=${API_KEY}`,
        }),
        getMovieCertification: builder.query({
            query: (movieId) => `/movie/${movieId}/release_dates?api_key=${API_KEY}`,
        }),
        searchMovies: builder.query({
            query: (searchTerm) => `/search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=1&include_adult=false`,
            transformResponse: (response) => response.results,
        }),
    }),
});

export const {
    useGetMovieDetailsQuery,
    useGetMovieVideosQuery,
    useGetMovieCertificationQuery,
    useSearchMoviesQuery
} = moviesApiSlice;
