import { api } from '../lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  
  signup: async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/register', { email, password, full_name: name });
    return res.data;
  }
};
