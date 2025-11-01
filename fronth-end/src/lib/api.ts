import { toast } from "@/components/ui/use-toast";

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

const handleError = (error: any) => {
  console.error('API Error:', error);
  const message = error instanceof APIError 
    ? error.message 
    : 'An unexpected error occurred';
  
  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });

  throw error;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Prompts
  getAllPrompts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts`);
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to fetch prompts');
      }
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  getPrompt: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${id}`);
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to fetch prompt');
      }
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  createPrompt: async (promptData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to create prompt');
      }
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  updatePrompt: async (id: string, promptData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to update prompt');
      }
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  deletePrompt: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to delete prompt');
      }
      return response.ok;
    } catch (error) {
      return handleError(error);
    }
  },

  // Comments
  addComment: async (promptId: string, commentData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${promptId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to add comment');
      }
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  // Versions
  addVersion: async (promptId: string, versionData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${promptId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to add version');
      }
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },
};