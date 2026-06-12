import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Routes / Search
export const searchRoutes = (params) => api.get('/routes/search', { params });
export const getCities = () => api.get('/routes/cities');
export const getRouteById = (id) => api.get(`/routes/${id}`);
export const getSeats = (routeId) => api.get(`/routes/${routeId}/seats`);

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminBuses = () => api.get('/admin/buses');
export const createBus = (data) => api.post('/admin/buses', data);
export const updateBus = (id, data) => api.put(`/admin/buses/${id}`, data);
export const deleteBus = (id) => api.delete(`/admin/buses/${id}`);
export const getAdminRoutes = () => api.get('/admin/routes');
export const createRoute = (data) => api.post('/admin/routes', data);
export const updateRoute = (id, data) => api.put(`/admin/routes/${id}`, data);
export const deleteRoute = (id) => api.delete(`/admin/routes/${id}`);
export const getAdminBookings = () => api.get('/admin/bookings');

export default api;
