import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use((config) => {
    let token = localStorage.getItem('token');

    if (!token) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                token = JSON.parse(userInfo).token;
            } catch (e) { }
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
