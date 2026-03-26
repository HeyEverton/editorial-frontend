import axios from 'axios';

// Usar variável de ambiente em produção, localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


// Configurar axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Funções de gerenciamento de token
export function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
    localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

// Interface de usuário
export interface User {
    id: number;
    email: string;
    nome?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

// Registrar novo usuário
export async function register(email: string, senha: string, nome?: string): Promise<AuthResponse> {
    try {
        const response = await api.post<AuthResponse>('/auth/register', {
            email,
            senha,
            nome,
        });

        // Salvar token
        setToken(response.data.token);

        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao registrar usuário' };
    }
}

// Login
export async function login(email: string, senha: string): Promise<AuthResponse> {
    try {
        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            senha,
        });

        // Salvar token
        setToken(response.data.token);

        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao fazer login' };
    }
}

// Logout
export function logout(): void {
    removeToken();
}

// Verificar token
export async function verifyToken(): Promise<{ user: User }> {
    try {
        const response = await api.get<{ user: User }>('/auth/verify');
        return response.data;
    } catch (error: any) {
        removeToken();
        throw error.response?.data || { message: 'Token inválido' };
    }
}

// Obter dados do usuário atual
export async function getCurrentUser(): Promise<User | null> {
    try {
        const { user } = await verifyToken();
        return user;
    } catch (error) {
        return null;
    }
}

export default api;
