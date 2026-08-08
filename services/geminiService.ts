import api from "./authService";
import { EditorialDocument } from "../types";

export type AIWorkflowMode = 'generative' | 'structural';

export const structureContent = async (
  rawText: string, 
  referenceContext?: string, 
  workflow: AIWorkflowMode = 'generative'
): Promise<EditorialDocument> => {
  try {
    const response = await api.post<EditorialDocument>('/ai/generate', {
      rawText,
      referenceContext,
      workflow
    });

    if (!response.data) {
      throw new Error("A API do backend retornou uma resposta vazia.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Erro ao solicitar geração de conteúdo ao backend:", error);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message || "Falha ao gerar o planejamento editorial.");
  }
};
