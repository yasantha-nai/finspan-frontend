const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const configService = {
    getSampleConfig: async (): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/sample-config`);
        if (!response.ok) throw new Error('Failed to fetch sample config');
        return await response.json();
    }
};
