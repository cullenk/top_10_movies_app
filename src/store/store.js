import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import moviesReducer from './moviesSlice';
import { moviesApiSlice } from './moviesApiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    [moviesApiSlice.reducerPath]: moviesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(moviesApiSlice.middleware),
});
