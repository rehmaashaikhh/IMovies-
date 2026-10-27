import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { BiHeart } from 'react-icons/bi';
import { HiTicket } from 'react-icons/hi';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('imovies_watchlist') || '[]');
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, []);

  const handleRemoveFavorite = (movie) => {
    const movieId = movie._id || movie.id;
    const updated = favorites.filter((m) => (m._id || m.id) !== movieId);
    setFavorites(updated);
    localStorage.setItem('imovies_watchlist', JSON.stringify(updated));
  };

  return (
    <div className="container py-4">
      <div className="cinema-banner-header">
        Your Watchlist &amp; Favorites
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5 my-4 bg-dark rounded-3 border border-secondary border-opacity-25">
          <BiHeart size={48} className="text-danger mb-3" />
          <h4 className="text-light fw-bold">Your Watchlist is Empty</h4>
          <p className="text-muted small mb-3">
            Click the heart icon on any movie in the catalogue to save it to your personal watchlist.
          </p>
          <Link to="/movies" className="btn btn-cinema-red btn-sm">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {favorites.map((movie) => (
            <div key={movie._id || movie.id} className="col">
              <MovieCard
                movie={movie}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
