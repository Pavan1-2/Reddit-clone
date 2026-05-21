import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Match your backend port
    withCredentials: true // 🚨 CRITICAL: Sends your HTTP-only cookie
});