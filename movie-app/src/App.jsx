import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import CurrentDate from './components/CurrentDate';
import MovieCard from './components/MovieCard';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from './firebase-config';
import { getUserMovies } from './apiService'; // Import the API function

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState(Array(10).fill(null)); // Initialize with 10 null slots

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchMovies();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMovies = async () => {
    try {
      const userMovies = await getUserMovies();
      // Fill the array with user movies, leaving null for empty slots
      setMovies(prevMovies => {
        const newMovies = [...prevMovies];
        userMovies.forEach((movie, index) => {
          if (index < 10) {
            newMovies[index] = movie;
          }
        });
        return newMovies;
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
  
  return (
    <>
      {user ? (
        <main>
          <div className="pattern" />
          <div className="wrapper">
            <CurrentDate />
            <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1 className='mb-20'>My <span className="text-gradient">Top 10 </span>Favorite Movies</h1>
            </header>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 justify-items-stretch">
              {movies.map((movie, index) => (
                <div key={index} className='relative h-full'>
                  <h2 className='z-10 text-7xl text-gradient absolute -top-10 -left-5 -rotate-8 shadow-2xl'>{index + 1}</h2>
                  <MovieCard index={index} movie={movie} onUpdate={fetchMovies} />
                </div>
              ))}
            </section>
          </div>
        </main>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
