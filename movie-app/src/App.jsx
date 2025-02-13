import React from 'react';
import CurrentDate from './components/CurrentDate';
import MovieCard from './components/MovieCard';

const App = () => {
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <CurrentDate />
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1 className='mb-20'>My <span className="text-gradient">Top 10 </span>Favorite Movies</h1>
        </header>
        <section className="top-ten-movies grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {[...Array(10)].map((_, index) => (
            <div className='relative'>
             <h2 className='z-10 text-7xl text-gradient absolute -top-10 -left-5 -rotate-8 shadow-2xl'>{index + 1}</h2>
            <MovieCard key={index} index={index} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default App;
