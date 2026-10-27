import api from './api';

export const movieService = {
  // Get all movies
  getAllMovies: async (params = {}) => {
    const response = await api.get('/api/movie', { params });
    return response.data;
  },

  // Get single movie by ID
  getMovieById: async (id) => {
    const response = await api.get(`/api/movie/${id}`);
    return response.data;
  },

  // Admin: Add new movie
  addMovie: async (movieData) => {
    const response = await api.post('/api/movie/addmovie', movieData);
    return response.data;
  },

  // Admin: Update movie
  updateMovie: async (id, movieData) => {
    const response = await api.put(`/api/movie/${id}`, movieData);
    return response.data;
  },

  // Admin: Delete movie
  deleteMovie: async (id) => {
    const response = await api.delete(`/api/movie/${id}`);
    return response.data;
  },
};
