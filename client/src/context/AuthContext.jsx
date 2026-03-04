import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios'; // Automatically attaches tokens via interceptor

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            // Check legacy token first to ensure backwards compatibility without a hard logout
            let token = localStorage.getItem('token');
            if (!token && localStorage.getItem('userInfo')) {
                try {
                    token = JSON.parse(localStorage.getItem('userInfo')).token;
                    if (token) {
                        localStorage.setItem('token', token);
                        localStorage.removeItem('userInfo');
                    }
                } catch (e) { }
            }

            if (token) {
                try {
                    const res = await api.get('/auth/me'); // Native profile API
                    setUser(res.data);
                } catch (error) {
                    console.error('Failed to validate token from API, logging out implicitly:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('https://trackify-server-chi.vercel.app/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return { success: true, role: res.data.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('https://trackify-server-chi.vercel.app/api/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return { success: true, role: res.data.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo'); // Purge legacy object completely
    };

    const updateUser = (data) => {
        setUser(data);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
