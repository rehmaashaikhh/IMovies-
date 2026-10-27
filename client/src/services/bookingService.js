import api from './api';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (email) => {
    const response = await api.get('/api/bookings/mybookings', {
      params: email ? { email } : {},
    });
    return response.data;
  },

  // Admin: Get all bookings
  getAllBookings: async () => {
    const response = await api.get('/api/bookings/all');
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/api/bookings/cancel/${bookingId}`);
    return response.data;
  },
};
