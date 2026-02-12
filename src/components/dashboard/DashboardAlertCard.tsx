import { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionAlert = motion.create(Alert);

interface DashboardAlertCardProps {
    severity?: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string | ReactNode;
    onAdjustPlan?: () => void;
    onViewOptions?: () => void;
    onDismiss?: () => void;
    runwayAge?: number;
    targetAge?: number;
}

export function DashboardAlertCard({
    severity = 'info',
    title,
    message,
    onAdjustPlan,
    onViewOptions,
    onDismiss,
    runwayAge,
    targetAge = 95,
}: DashboardAlertCardProps) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            onDismiss?.();
        }, 300);
    };

    const getIcon = () => {
        switch (severity) {
            case 'success':
                return 'solar:verified-check-bold-duotone';
            case 'warning':
                return 'solar:danger-triangle-bold-duotone';
            case 'error':
                return 'solar:close-circle-bold-duotone';
            default:
                return 'solar:info-circle-bold-duotone';
        }
    };

    return (
        <Collapse in={open}>
            <MotionAlert
                severity={severity}
                variant="filled"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                icon={<Icon icon={getIcon()} width={24} />}
                action={
                    onDismiss && (
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <Icon icon="solar:close-circle-bold" width={20} />
                        </IconButton>
                    )
                }
                sx={{
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <AlertTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{title}</AlertTitle>

                <Box sx={{ mb: 2 }}>{typeof message === 'string' ? <Typography variant="body2">{message}</Typography> : message}</Box>

                {/* Runway Display */}
                {runwayAge && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                            p: 1.5,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 1,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                Current Projection
                            </Typography>
                            <Typography variant="h6" fontWeight={700}>
                                Age {runwayAge}
                            </Typography>
                        </Box>
                        <Icon icon="solar:arrow-right-bold" width={20} />
                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                Target
                            </Typography>
                            <Typography variant="h6" fontWeight={700}>
                                Age {targetAge}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Action Buttons */}
                {(onAdjustPlan || onViewOptions) && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {onAdjustPlan && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Icon icon="solar:pen-bold-duotone" />}
                                onClick={onAdjustPlan}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Adjust Plan
                            </Button>
                        )}
                        {onViewOptions && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Icon icon="solar:eye-bold-duotone" />}
                                onClick={onViewOptions}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                View Options
                            </Button>
                        )}
                    </Box>
                )}
            </MotionAlert>
        </Collapse>
    );
}
