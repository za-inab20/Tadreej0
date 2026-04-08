import axios from 'axios';

export const API_BASE = 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE,
});

export const getUserConfig = (user) => ({
  headers: {
    'x-user-email': user?.email || '',
  },
});

export const getAdminConfig = (user) => getUserConfig(user);
