import { useState, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';
import { retirementService } from '@/services/retirement.service';
import { SimulationResponse } from '@/types/retirement-types';

interface CsvUploadSectionProps {
    onSimulationComplete: (results: SimulationResponse) => void;
}

export const CsvUploadSection = ({ onSimulationComplete }: CsvUploadSectionProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (file: File) => {
        if (!file.name.endsWith('.csv')) {
            setError('Please select a valid CSV file.');
            return;
        }
        setSelectedFile(file);
        setError(null);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUploadAndRun = async () => {
        if (!selectedFile) {
            setError('Please select a CSV file first.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const results = await retirementService.uploadConfigFile(selectedFile);
            onSimulationComplete(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadTemplate = () => {
        retirementService.downloadTemplate();
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Upload Configuration File
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a CSV file with your retirement planning parameters.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Box
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: dragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: dragActive ? 'action.hover' : 'background.paper',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    mb: 2,
                }}
                onClick={() => document.getElementById('csv-file-input')?.click()}
            >
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                    Drag and drop your CSV file here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    or
                </Typography>
                <input
                    id="csv-file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />
                <Button variant="outlined" component="span">
                    Click to browse
                </Button>
            </Box>

            {selectedFile && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Selected file: <strong>{selectedFile.name}</strong>
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadTemplate}
                >
                    Download Sample Template
                </Button>

                <Button
                    variant="contained"
                    onClick={handleUploadAndRun}
                    disabled={!selectedFile || isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} /> : undefined}
                >
                    {isUploading ? 'Running Simulation...' : 'Run Simulation'}
                </Button>
            </Box>
        </Paper>
    );
};
