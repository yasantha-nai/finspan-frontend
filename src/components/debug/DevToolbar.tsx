import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/AuthContext';

export default function DevToolbar() {
    // Only show in development
    if (!import.meta.env.DEV) return null;

    const navigate = useNavigate();
    const { user, logout, dev_resetOnboarding } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = async (action: () => Promise<void> | void) => {
        await action();
        handleClose();
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
            <Tooltip title="Dev Tools">
                <Fab
                    color="secondary"
                    aria-label="dev-tools"
                    onClick={handleOpen}
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: '#6366F1',
                        '&:hover': { bgcolor: '#4F46E5' }
                    }}
                >
                    <Icon icon="solar:code-bold" width={24} color="white" />
                </Fab>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: -1,
                        ml: -1,
                        minWidth: 200,
                        boxShadow: 4,
                        borderRadius: 2,
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        Developer Tools
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Localhost Environment
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={() => handleAction(() => navigate('/dashboard'))}>
                    <Icon icon="solar:home-angle-bold-duotone" width={20} style={{ marginRight: 8 }} />
                    Go to Dashboard
                </MenuItem>

                <MenuItem onClick={() => handleAction(() => navigate('/simulator'))}>
                    <Icon icon="solar:rocket-bold-duotone" width={20} style={{ marginRight: 8 }} />
                    Go to Simulator (Onboarding)
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={() => handleAction(() => dev_resetOnboarding())}>
                    <Icon icon="solar:restart-bold-duotone" width={20} style={{ marginRight: 8 }} />
                    Reset Onboarding Status
                </MenuItem>

                <MenuItem 
                    onClick={() => handleAction(() => {
                        if (confirm('⚠️ This will clear ALL your simulation data (inputs, results, scenarios). Continue?')) {
                            localStorage.removeItem('simulation_inputs');
                            localStorage.removeItem('simulation_result');
                            localStorage.removeItem('retirement_scenarios');
                            console.log('✅ All simulation data cleared from localStorage');
                            alert('Data cleared! Page will reload.');
                            window.location.reload();
                        }
                    })}
                    sx={{ color: 'warning.main' }}
                >
                    <Icon icon="solar:trash-bin-minimalistic-bold-duotone" width={20} style={{ marginRight: 8 }} />
                    Clear Simulation Data
                </MenuItem>

                <MenuItem 
                    onClick={() => handleAction(() => {
                        if (confirm('⚠️ DANGER: This will clear EVERYTHING including auth tokens. You will be logged out. Continue?')) {
                            localStorage.clear();
                            sessionStorage.clear();
                            console.log('✅ All localStorage and sessionStorage cleared');
                            alert('Everything cleared! Redirecting to home...');
                            window.location.href = '/';
                        }
                    })}
                    sx={{ color: 'error.main' }}
                >
                    <Icon icon="solar:danger-bold-duotone" width={20} style={{ marginRight: 8 }} />
                    Clear ALL Data (Logout)
                </MenuItem>

                {user && (
                    <>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <MenuItem onClick={() => handleAction(logout)} sx={{ color: 'text.secondary' }}>
                            <Icon icon="solar:logout-3-bold-duotone" width={20} style={{ marginRight: 8 }} />
                            Force Logout
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );
}
