import useSWR, { mutate } from 'swr';
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

// Aggiungiamo una funzione per il refresh del token
const refreshToken = async () => {
    try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) throw new Error('No refresh token available');

        const response = await axios.post(`${API_BASE_URL}/users/refresh`, {
            refresh_token
        });

        if (response.data.access_token) {
            localStorage.setItem('auth_token', response.data.access_token);
            return response.data.access_token;
        }
        throw new Error('No access token received');
    } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw error;
    }
};

// Aggiungiamo l'interceptor per gestire il refresh automatico
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se l'errore non è 401 o la richiesta è già stata ritentata, propaghiamo l'errore
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // Se stiamo già facendo refresh, mettiamo la richiesta in coda
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const token = await refreshToken();
            processQueue(null, token);
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

// Fetcher generico per SWR
const fetcher = url => api.get(url).then(res => res.data);

// Posts API con SWR
export const postsApi = {
    useGetAll: () => {
        const { data, error, isLoading } = useSWR('/posts', fetcher);
        return {
            posts: data,
            isLoading,
            isError: error
        };
    },
    create: async (formData) => {
        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        mutate('/posts'); // Rivalidare la cache dopo la creazione
        return response;
    },
    update: async (id, data) => {
        const response = await api.put(`/posts/${id}`, data);
        mutate('/posts'); // Rivalidare la cache dopo l'aggiornamento
        return response;
    },
    delete: async (id) => {
        const response = await api.delete(`/posts/${id}`);
        mutate('/posts'); // Rivalidare la cache dopo l'eliminazione
        return response;
    }
};

// Users API con SWR
export const usersApi = {
    useGetAll: () => {
        const { data, error, isLoading } = useSWR('/users', fetcher);
        return {
            users: data,
            isLoading,
            isError: error
        };
    },
    update: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        mutate('/users');
        return response;
    },
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        mutate('/users');
        return response;
    }
};

// Comments API con SWR
export const commentsApi = {
    useGetAll: () => {
        const { data, error, isLoading } = useSWR('/comments', fetcher);
        return {
            comments: data,
            isLoading,
            isError: error
        };
    },
    create: async (data) => {
        const response = await api.post('/comments', data);
        mutate('/comments');
        return response;
    },
    update: async (id, data) => {
        const response = await api.put(`/comments/${id}`, data);
        mutate('/comments');
        return response;
    },
    delete: async (id) => {
        const response = await api.delete(`/comments/${id}`);
        mutate('/comments');
        return response;
    }
};

// Likes API con SWR
export const likesApi = {
    useGetAll: () => {
        const { data, error, isLoading } = useSWR('/likes', fetcher);
        return {
            likes: data,
            isLoading,
            isError: error
        };
    },
    create: async (data) => {
        const response = await api.post('/likes', data);
        mutate('/likes');
        return response;
    },
    delete: async (id) => {
        const response = await api.delete(`/likes/${id}`);
        mutate('/likes');
        return response;
    }
};

// Auth API (rimane simile perché non necessita di SWR)
export const authApi = {
    loginUser: async (username, password) => {
        try {
            const response = await api.post('/users/login', {
                username,
                password
            });
            
            if (response.data) {
                localStorage.setItem('auth_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
            }
            
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },
    
    refreshToken: async () => {
        return refreshToken();
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        // Pulisci la cache SWR
        mutate('/posts', null, false);
        mutate('/users', null, false);
        mutate('/comments', null, false);
        mutate('/likes', null, false);
    }
}; 