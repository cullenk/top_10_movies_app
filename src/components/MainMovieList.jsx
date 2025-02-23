import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMovie, removeMovie } from '../store/moviesSlice';
import MovieCard from './MovieCard';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";

const MainMovieList = () => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies);
  const user = useSelector(state => state.user);

  const handleAddMovie = async (movieData, slot) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`topMovieList.${slot - 1}`]: movieData.id
      });
      dispatch(addMovie({ movie: movieData, slot }));
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error('Error adding movie');
    }
  };
  

  const handleRemoveMovie = async (slot) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`topMovieList.${slot - 1}`]: null
      });
      dispatch(removeMovie(slot));
      toast.success('Movie removed successfully');
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error('Error removing movie');
    }
  };
  

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 justify-items-stretch">
      {movies.map((movie, index) => (
        <div key={index} className="relative h-full">
          <h2 className="z-10 text-7xl text-gradient absolute -top-10 -left-5 -rotate-8 shadow-2xl">
            {index + 1}
          </h2>
          <MovieCard
            index={index}
            movie={movie}
            onAddMovie={(movieData) => handleAddMovie(movieData, index + 1)}
            onRemoveMovie={handleRemoveMovie}
          />
        </div>
      ))}
    </section>
  );
};

export default MainMovieList;
