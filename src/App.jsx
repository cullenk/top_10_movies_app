import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import { setMovies } from './store/moviesSlice';
import Auth from "./components/Auth";
import HeaderBar from "./components/HeaderBar";
import MainMovieList from "./components/MainMovieList";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("User authenticated:", user.uid);
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        console.log("No user authenticated");
        dispatch(clearUser());
        dispatch(setMovies(Array(10).fill(null)));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  
  
  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);  

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const fetchMovies = async () => {
    try {
      if (!user) {
        console.log("Attempting to fetch movies without user");
        toast.error('User not authenticated');
        return;
      }
  
      // console.log("Fetching movies for user:", user.uid);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userMovies = userData.topMovieList || {};
  
        console.log("User movies:", userMovies);
        const newMovies = Array(10).fill(null);
        for (let i = 0; i < 10; i++) {
          const movieId = userMovies[i];
          if (movieId) {
            const movieDetails = await fetchMovieDetails(movieId);
            if (movieDetails) {
              newMovies[i] = movieDetails;
            }
          }
        }
        dispatch(setMovies(newMovies));
  
        if (Object.keys(userMovies).length > 0) {
          // console.log('Received movies from database');
        } else {
          toast.info('You have no saved movies yet!');
        }
      } else {
        console.log("User document not found, creating new profile");
        await setDoc(userDocRef, { topMovieList: {} });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error('Error fetching movies');
    }
  };

  return (
    <>
      {user ? (
        <main>
          <div className="pattern" />
          <div className="wrapper">
            <HeaderBar />
            <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1 className="mb-20">
                My <span className="text-gradient">Top 10 </span>Favorite Movies
              </h1>
            </header>
            <MainMovieList />
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
