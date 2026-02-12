/**
 * API Service for Retirement Planner Backend
 * Connects to FastAPI backend running on port 5050
 */

import {
    RetirementSimulationParams,
    SimulationResponse,
    MonteCarloParams,
    MonteCarloResults,
} from '@/types/retirement-types';

const RETIREMENT_API_BASE_URL =
    import.meta.env.VITE_RETIREMENT_API_URL || 'http://localhost:5050/api';

export const retirementService = {
    /**
     * Run deterministic retirement simulation with both strategies
     */
    runSimulation: async (params: RetirementSimulationParams): Promise<SimulationResponse> => {
        try {
            const response = await fetch(`${RETIREMENT_API_BASE_URL}/run-simulation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Retirement simulation request failed:', error);
            throw error;
        }
    },

    /**
     * Run Monte Carlo simulation with volatility
     */
    runMonteCarlo: async (params: MonteCarloParams): Promise<MonteCarloResults> => {
        try {
            const response = await fetch(`${RETIREMENT_API_BASE_URL}/run-monte-carlo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Monte Carlo simulation request failed:', error);
            throw error;
        }
    },

    /**
     * Upload CSV configuration file
     */
    uploadConfigFile: async (file: File): Promise<SimulationResponse> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${RETIREMENT_API_BASE_URL}/run-simulation`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('CSV upload failed:', error);
            throw error;
        }
    },

    /**
     * Get current configuration (last uploaded/run)
     */
    getCurrentConfig: async (): Promise<Record<string, any>> => {
        try {
            const response = await fetch(`${RETIREMENT_API_BASE_URL}/get-current-config`);

            if (!response.ok) {
                throw new Error(`Failed to fetch config: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get current config:', error);
            return {};
        }
    },

    /**
     * Export configuration as CSV file
     */
    exportConfig: async (params: RetirementSimulationParams): Promise<Blob> => {
        try {
            const response = await fetch(`${RETIREMENT_API_BASE_URL}/export-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`Export failed: ${response.statusText}`);
            }

            return await response.blob();
        } catch (error) {
            console.error('Config export failed:', error);
            throw error;
        }
    },

    /**
     * Download sample CSV template
     */
    downloadTemplate: (): void => {
        window.open(`${RETIREMENT_API_BASE_URL.replace('/api', '')}/download-template`, '_blank');
    },
};
