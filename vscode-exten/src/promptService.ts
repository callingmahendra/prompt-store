import axios from 'axios';
import { Config } from './config';

export interface Prompt {
    id: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    rating: number;
    author: string;
    date: string;
    usageCount: number;
    comments?: any[];
    stars?: any[];
}

export class PromptService {
    private get baseUrl(): string {
        return Config.getApiUrl();
    }

    async getPrompts(): Promise<Prompt[]> {
        try {
            const response = await axios.get(this.baseUrl);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch prompts:', error);
            return [];
        }
    }

    async getPrompt(id: string): Promise<Prompt | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch prompt:', error);
            return null;
        }
    }

    async starPrompt(id: string): Promise<boolean> {
        try {
            const userId = Config.getUserId();
            const response = await axios.post(`${this.baseUrl}/${id}/star`, { userId });
            return response.data.starred;
        } catch (error) {
            console.error('Failed to star prompt:', error);
            return false;
        }
    }

    async getStarStatus(id: string): Promise<boolean> {
        try {
            const userId = Config.getUserId();
            const response = await axios.get(`${this.baseUrl}/${id}/star/${userId}`);
            return response.data.starred;
        } catch (error) {
            console.error('Failed to get star status:', error);
            return false;
        }
    }
}