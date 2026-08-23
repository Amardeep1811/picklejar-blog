import axios from './axios';
export const login = (data) => axios.post('/auth/login', data);