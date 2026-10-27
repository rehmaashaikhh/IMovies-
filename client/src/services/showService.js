import api from './api';

export const showService = {
  // Get all shows
  getAllShows: async () => {
    const response = await api.get('/api/shows');
    return response.data;
  },

  // Get shows for a specific movie (as referenced on page 27)
  getMovieShows: async (movieName) => {
    const response = await api.get(`/api/shows/getmovieshows/${encodeURIComponent(movieName)}`);
    return response.data;
  },

  // Get show by ID
  getShowById: async (id) => {
    const response = await api.get(`/api/shows/${id}`);
    return response.data;
  },

  // Admin: Add new show
  addShow: async (showData) => {
    const response = await api.post('/api/shows/addshow', showData);
    return response.data;
  },

  // Admin: Delete show
  deleteShow: async (id) => {
    const response = await api.delete(`/api/shows/${id}`);
    return response.data;
  },
};
