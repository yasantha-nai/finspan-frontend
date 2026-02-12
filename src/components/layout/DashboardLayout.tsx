import { useState, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { muiTheme } from '@/theme/mui-theme';
import { NavSidebar, NavItem } from './NavSidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
    children: ReactNode;
    navItems: NavItem[];
    title?: string;
}

const NAV_WIDTH = 280;

export function DashboardLayout({ children, navItems, title = 'Dashboard' }: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar Navigation */}
                {isMobile ? (
                    <NavSidebar
                        navItems={navItems}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        variant="temporary"
                    />
                ) : (
                    <NavSidebar navItems={navItems} variant="permanent" />
                )}

                {/* Main Content with Header inside */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { md: `calc(100% - ${NAV_WIDTH}px)` },
                        minHeight: '100vh',
                        bgcolor: 'background.default',
                    }}
                >
                    {/* Header - Sticky position, inside main content */}
                    <DashboardHeader
                        onMenuClick={handleDrawerToggle}
                        showMenuButton={isMobile}
                    />

                    {/* Page Content */}
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
