import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import { useLocation, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export type NavItem = {
    title: string;
    path: string;
    icon: React.ReactNode;
};

interface NavSidebarProps {
    navItems: NavItem[];
    open?: boolean;
    onClose?: () => void;
    variant?: 'permanent' | 'temporary';
}

const NAV_WIDTH = 280;

export function NavSidebar({ navItems, open = true, onClose, variant = 'permanent' }: NavSidebarProps) {
    const location = useLocation();
    const theme = useTheme();

    const drawerContent = (
        <Box
            sx={{
                pt: 2.5,
                px: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
            }}
        >
            {/* Logo */}
            <Box
                component={Link}
                to="/"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    textDecoration: 'none',
                    color: 'inherit'
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        bgcolor: '#00A76F', // success.main
                        boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)', // shadow-success/20 approx
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon icon="solar:chart-bold-duotone" width={24} color="white" />
                </Box>
                <Box sx={{ typography: 'h6', fontWeight: 700, fontFamily: 'Public Sans, sans-serif' }}>
                    FinSpan
                </Box>
            </Box>

            {/* Navigation Items - with my: 2 spacing like material-kit */}
            <Box
                component="nav"
                sx={{
                    my: 2,
                    display: 'flex',
                    flex: '1 1 auto',
                    flexDirection: 'column',
                }}
            >
                <Box
                    component="ul"
                    sx={{
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        listStyle: 'none',
                        p: 0,
                        m: 0,
                    }}
                >
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <ListItem key={item.title} disableGutters disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={onClose}
                                    disableGutters
                                    sx={{
                                        pl: 2,
                                        py: 1,
                                        gap: 2,
                                        pr: 1.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        fontWeight: 'fontWeightMedium',
                                        color: theme.palette.text.secondary,
                                        minHeight: 44,
                                        ...(isActive && {
                                            fontWeight: 'fontWeightSemiBold',
                                            color: theme.palette.primary.main,
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.16),
                                            },
                                        }),
                                    }}
                                >
                                    <Box component="span" sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center' }}>
                                        {item.icon}
                                    </Box>

                                    <Box component="span" sx={{ flexGrow: 1 }}>
                                        {item.title}
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </Box>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ typography: 'caption', color: 'text.secondary', textAlign: 'center' }}>
                    © 2026 FinSpan
                </Box>
            </Box>
        </Box>
    );

    if (variant === 'temporary') {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: NAV_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: NAV_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: NAV_WIDTH,
                    boxSizing: 'border-box',
                    borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
}
