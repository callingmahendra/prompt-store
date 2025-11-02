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
            // Fetch all prompts by setting a high limit to avoid pagination
            const response = await axios.get(this.baseUrl, {
                params: { limit: 1000 }
            });
            
            // Handle both array response and paginated response
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data.prompts && Array.isArray(response.data.prompts)) {
                return response.data.prompts;
            } else {
                console.error('Unexpected API response format:', response.data);
                return [];
            }
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

    /**
     * Search prompts by various criteria using the API
     */
    async searchPrompts(query: string, searchBy: 'title' | 'tags' | 'content' | 'author' | 'all' = 'all'): Promise<Prompt[]> {
        try {
            // Use the API search endpoint for better performance
            if (searchBy === 'all' || searchBy === 'title' || searchBy === 'content') {
                const response = await axios.get(`${this.baseUrl}/search`, {
                    params: { q: query }
                });
                return Array.isArray(response.data) ? response.data : response.data.prompts || [];
            } else if (searchBy === 'tags') {
                const response = await axios.get(`${this.baseUrl}/search`, {
                    params: { tag: query }
                });
                return Array.isArray(response.data) ? response.data : response.data.prompts || [];
            } else {
                // Fallback to client-side filtering for author search
                const allPrompts = await this.getPrompts();
                const searchTerm = query.toLowerCase().trim();
                
                if (!searchTerm) {
                    return allPrompts;
                }

                return allPrompts.filter(prompt => {
                    return prompt.author.toLowerCase().includes(searchTerm);
                });
            }
        } catch (error) {
            console.error('Failed to search prompts:', error);
            // Fallback to client-side search
            return this.searchPromptsClientSide(query, searchBy);
        }
    }

    /**
     * Client-side search fallback
     */
    private async searchPromptsClientSide(query: string, searchBy: 'title' | 'tags' | 'content' | 'author' | 'all' = 'all'): Promise<Prompt[]> {
        try {
            const allPrompts = await this.getPrompts();
            const searchTerm = query.toLowerCase().trim();
            
            if (!searchTerm) {
                return allPrompts;
            }

            return allPrompts.filter(prompt => {
                switch (searchBy) {
                    case 'title':
                        return prompt.title.toLowerCase().includes(searchTerm);
                    case 'tags':
                        return prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                    case 'content':
                        return prompt.content.toLowerCase().includes(searchTerm);
                    case 'author':
                        return prompt.author.toLowerCase().includes(searchTerm);
                    case 'all':
                    default:
                        return (
                            prompt.title.toLowerCase().includes(searchTerm) ||
                            prompt.description.toLowerCase().includes(searchTerm) ||
                            prompt.content.toLowerCase().includes(searchTerm) ||
                            prompt.author.toLowerCase().includes(searchTerm) ||
                            prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                        );
                }
            });
        } catch (error) {
            console.error('Failed to search prompts client-side:', error);
            return [];
        }
    }

    /**
     * Get prompts by specific tag
     */
    async getPromptsByTag(tag: string): Promise<Prompt[]> {
        return this.searchPrompts(tag, 'tags');
    }

    /**
     * Get prompts by author
     */
    async getPromptsByAuthor(author: string): Promise<Prompt[]> {
        return this.searchPrompts(author, 'author');
    }

    /**
     * Get all unique tags from prompts
     */
    async getAllTags(): Promise<string[]> {
        try {
            const prompts = await this.getPrompts();
            const allTags = prompts.flatMap(prompt => prompt.tags);
            return [...new Set(allTags)].sort();
        } catch (error) {
            console.error('Failed to get tags:', error);
            return [];
        }
    }

    /**
     * Get popular tags from the API
     */
    async getPopularTags(limit: number = 20): Promise<Array<{tag: string, count: number}>> {
        try {
            const response = await axios.get(`${this.baseUrl}/tags/popular?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get popular tags:', error);
            return [];
        }
    }

    /**
     * Get all unique authors from prompts
     */
    async getAllAuthors(): Promise<string[]> {
        try {
            const prompts = await this.getPrompts();
            const allAuthors = prompts.map(prompt => prompt.author);
            return [...new Set(allAuthors)].sort();
        } catch (error) {
            console.error('Failed to get authors:', error);
            return [];
        }
    }

    /**
     * Track prompt usage (increment usage count)
     */
    async trackUsage(id: string): Promise<boolean> {
        try {
            const response = await axios.post(`${this.baseUrl}/${id}/use`);
            return response.data.success;
        } catch (error) {
            console.error('Failed to track usage:', error);
            return false;
        }
    }
}