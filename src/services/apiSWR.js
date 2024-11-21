import useSWR, { mutate } from 'swr';
import axios from 'axios';
import useSWRInfinite from 'swr/infinite';

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

// Aggiungiamo l'interceptor per le richieste
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Modifichiamo il fetcher per includere il token
const fetcher = url => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error('No auth token available');
    }
    return api.get(url).then(res => res.data);
};

// Posts API con SWR
export const postsApi = {
    useGetAll: (options = {}) => {
        const { data, error, size, setSize, isLoading } = useSWRInfinite(
            (pageIndex) => `${API_BASE_URL}/posts?page=${pageIndex + 1}&limit=5`,
            fetcher,
            {
                revalidateFirstPage: false,
                persistSize: true,
                revalidateOnFocus: false,
                revalidateIfStale: false,
                ...options
            }
        );

        const posts = data ? [].concat(...data) : [];
        const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
        const isEmpty = data?.[0]?.length === 0;
        const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 5);

        return {
            posts,
            error,
            isLoading: isLoading && !data,
            isLoadingMore,
            loadMore: () => setSize(size + 1),
            isReachingEnd,
            size,
            setSize
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
    },
    useGetUserPosts: (username) => {
        const { data, error, isLoading } = useSWR(
            username ? `/posts/user/${username}` : null,
            fetcher
        );
        return {
            posts: data,
            isLoading,
            isError: error
        };
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
    useGetMe: () => {
        const { data, error, isLoading } = useSWR(
            '/users/me',
            fetcher,
            {
                revalidateOnFocus: false,
                shouldRetryOnError: false
            }
        );

        return {
            user: data?.user,
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
    },
    useGetProfile: (username) => {
        const { data, error, isLoading } = useSWR(
            username ? `/users/profile/${username}` : null,
            fetcher
        );
        return {
            user: data?.user,
            isLoading,
            isError: error
        };
    }
};

// Comments API con SWR
export const commentsApi = {
    useGetAll: (postId) => {
        const { data, error, isLoading } = useSWR(`/comments/${postId}`, fetcher);
        return {
            comments: data,
            isLoading,
            isError: error
        };
    },
    getAll: async (postId) => {
        const response = await api.get(`/comments/${postId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/comments', data);
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
    checkLike: async (postId) => {
        const response = await api.get(`/likes/${postId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/likes', data);
        mutate('/likes');
        return response;
    },
    delete: async (postId) => {
        const response = await api.delete(`/likes/${postId}`);
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
    },

    checkUsername: async (username) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    checkEmail: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },
    
    registerUser: async (formData) => {
        try {
            const response = await api.post('/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data) {
                localStorage.setItem('auth_token', response.data.access_token);
                if (response.data.refresh_token) {
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                }
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}; 