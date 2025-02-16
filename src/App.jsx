import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import CurrentDate from "./components/CurrentDate";
import MovieCard from "./components/MovieCard";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState(Array(10).fill(null));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        setUser(user);
      } else {
        console.log("No user authenticated");
        setUser(null);
        setMovies(Array(10).fill(null));
      }
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);  

  const fetchMovies = async () => {
    
    try {
      if (!user) {
        console.log("Attempting to fetch movies without user");
        toast.error('User not authenticated');
        return;
      }
  
      console.log("Fetching movies for user:", user.uid);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        console.log("User document found");
        const userData = userDocSnap.data();
        const userMovies = userData.topMovieList || [];
  
        console.log("User movies:", userMovies);
        setMovies((prevMovies) => {
          const newMovies = Array(10).fill(null);
          userMovies.forEach((movie) => {
            if (movie.slot >= 1 && movie.slot <= 10) {
              newMovies[movie.slot - 1] = movie;
            }
          });
          return newMovies;
        });
  
        if (userMovies.length > 0) {
          toast.success('Populating movies from database');
        } else {
          toast.info('No movies found in the database');
        }
      } else {
        console.log("User document not found, creating new profile");
        await setDoc(userDocRef, { topMovieList: [] });
        toast.info('New user profile created');
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error('Error fetching movies');
    }
  };

  const addMovie = async (movieData, slot) => {
    try {
      console.log("Adding movie for user:", user.uid);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        console.log("User document not found, creating new one");
        await setDoc(userDocRef, { topMovieList: [] });
      }
      
      console.log("Updating document with new movie:", movieData);
      await updateDoc(userDocRef, {
        topMovieList: arrayUnion({ ...movieData, slot })
      });
      
      await fetchMovies();
      toast.success('Movie added successfully');
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error('Error adding movie');
    }
  };
  

  const removeMovie = async (slot) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const movieToRemove = userData.topMovieList.find(movie => movie.slot === slot);
      
      if (movieToRemove) {
        await updateDoc(userDocRef, {
          topMovieList: arrayRemove(movieToRemove)
        });
        await fetchMovies();
        toast.success('Movie removed successfully');
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error('Error removing movie');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMovies(Array(10).fill(null));
      toast.success('Logged out successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error logging out');
    }
  };

  return (
    <>
      {user ? (
        <main>
          <div className="pattern" />
          <div className="wrapper">
            <div>
              <CurrentDate />
              <button onClick={logout}>Logout</button>
            </div>

            <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1 className="mb-20">
                My <span className="text-gradient">Top 10 </span>Favorite Movies
              </h1>
            </header>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 justify-items-stretch">
              {movies.map((movie, index) => (
                <div key={index} className="relative h-full">
                  <h2 className="z-10 text-7xl text-gradient absolute -top-10 -left-5 -rotate-8 shadow-2xl">
                    {index + 1}
                  </h2>
                  <MovieCard
                    index={index}
                    movie={movie}
                    onAddMovie={(movieData) => addMovie(movieData, index + 1)}
                    onRemoveMovie={() => removeMovie(index + 1)}
                  />
                </div>
              ))}
            </section>
          </div>
          <ToastContainer />
        </main>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
