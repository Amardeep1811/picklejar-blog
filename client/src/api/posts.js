import axios from './axios';
export const getPosts = () => axios.get('/posts');