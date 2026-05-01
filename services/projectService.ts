import api from './authService';
import { EditorialDocument, LayoutSettings } from '../types';

export interface Project {
    id: number;
    userId: number;
    name: string;
    shortDescription: string;
    content: {
        doc: EditorialDocument;
        settings: LayoutSettings;
    };
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalProjects: number;
    lastUpdatedProject: Project | null;
}

export async function getProjects(): Promise<Project[]> {
    try {
        const response = await api.get<Project[]>('/projects');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao buscar projetos' };
    }
}

export async function getProjectById(id: number): Promise<Project> {
    try {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao buscar detalhes do projeto' };
    }
}

export async function createProject(name: string, doc: EditorialDocument, settings: LayoutSettings): Promise<Project> {
    try {
        const response = await api.post<Project>('/projects', {
            name,
            shortDescription: doc.subtitle || '',
            content: { doc, settings }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao criar projeto' };
    }
}

export async function updateProject(id: number, name: string, doc: EditorialDocument, settings: LayoutSettings): Promise<Project> {
    try {
        const response = await api.put<Project>(`/projects/${id}`, {
            name,
            shortDescription: doc.subtitle || '',
            content: { doc, settings }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao atualizar projeto' };
    }
}

export async function deleteProject(id: number): Promise<{ message: string }> {
    try {
        const response = await api.delete<{ message: string }>(`/projects/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao excluir projeto' };
    }
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const response = await api.get<DashboardStats>('/projects/dashboard');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Erro ao buscar estatísticas' };
    }
}
