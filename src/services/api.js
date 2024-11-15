import axios from 'axios';

export const BASE_URL = 'http://localhost/wavegram';
const API_BASE_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const postsApi = {
    getAll: () => api.get('/posts'),
    create: (formData) => {
        return api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, data) => api.put(`/posts/${id}`, data),
    delete: (id) => api.delete(`/posts/${id}`)
};

export const usersApi = {
    getAll: () => api.get('/users'),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`)
};

export const commentsApi = {
    getAll: () => api.get('/comments'),
    create: (data) => api.post('/comments', data),
    update: (id, data) => api.put(`/comments/${id}`, data),
    delete: (id) => api.delete(`/comments/${id}`)
};

export const likesApi = {
    getAll: () => api.get('/likes'),
    create: (data) => api.post('/likes', data),
    delete: (id) => api.delete(`/likes/${id}`)
};

export const authApi = {
    loginUser: async (username, password) => {
        try {
            const response = await api.post('/users/login', {
                username,
                password
            });
            
            if (response.data) {
                console.log('Saving tokens...');
                localStorage.setItem('auth_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                
                console.log('Saved tokens:', {
                    token: localStorage.getItem('auth_token'),
                    refresh_token: localStorage.getItem('refresh_token')
                });
            } else {
                console.log('No data property in response');
            }
            
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
};

