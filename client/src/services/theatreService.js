import api from './api';

export const theatreService = {
  // Get all theatres
  getAllTheatres: async () => {
    const response = await api.get('/api/theatre');
    return response.data;
  },

  // Admin: Add new theatre
  addTheatre: async (theatreData) => {
    const response = await api.post('/api/theatre/addtheatre', theatreData);
    return response.data;
  },

  // Admin: Delete theatre
  deleteTheatre: async (id) => {
    const response = await api.delete(`/api/theatre/${id}`);
    return response.data;
  },
};
