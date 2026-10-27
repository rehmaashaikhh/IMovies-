import React from 'react';
import { Link } from 'react-router-dom';
import { BiStar, BiHeart } from 'react-icons/bi';
import { HiTicket } from 'react-icons/hi';

const MovieCard = ({ movie, isFavorite = false, onToggleFavorite }) => {
  const movieId = movie._id || movie.id;
  const genres = Array.isArray(movie.genres) ? movie.genres : ['Action', 'Drama'];

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'In Cinemas';

  return (
    <div className="movie-card">
      <div className="movie-poster-wrapper">
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80'}
          alt={movie.movieName}
          className="movie-poster-img"
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="movie-rating-badge">
          <BiStar size={14} className="text-warning fill-warning" />
          <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}</span>
        </div>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            className={`movie-fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(movie);
            }}
            title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <BiHeart size={16} />
          </button>
        )}
      </div>

      <div className="movie-card-body">
        <h5 className="movie-card-title" title={movie.movieName}>
          {movie.movieName}
        </h5>

        <div className="movie-card-meta d-flex justify-content-between align-items-center">
          <span>{formattedDate}</span>
          <span className="badge bg-secondary bg-opacity-50 text-light py-1 px-2">{movie.certification || 'UA'}</span>
        </div>

        {/* Genre Tags */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {genres.slice(0, 2).map((genre, index) => (
            <span key={index} className="movie-genre-badge">
              {genre}
            </span>
          ))}
          {genres.length > 2 && (
            <span className="movie-genre-badge">+{genres.length - 2}</span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Link
            to={`/movie/${encodeURIComponent(movieId)}`}
            className="btn btn-cinema-red btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <HiTicket size={16} /> Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
