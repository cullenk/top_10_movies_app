import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: Array(10).fill(null),
  reducers: {
    setMovies: (state, action) => action.payload,
    addMovie: (state, action) => {
      const { movie, slot } = action.payload;
      state[slot - 1] = movie;
    },
    removeMovie: (state, action) => {
      state[action.payload - 1] = null;
    },
  },
});

export const { setMovies, addMovie, removeMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
