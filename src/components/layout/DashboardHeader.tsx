import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { Icon } from '@iconify/react';
import { alpha } from '@mui/material/styles';
import { AccountPopover } from './AccountPopover';
import { NotificationsPopover } from './NotificationsPopover';

interface DashboardHeaderProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export function DashboardHeader({ onMenuClick, showMenuButton = false }: DashboardHeaderProps) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <AppBar
            position="sticky"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer - 1,
                bgcolor: 'transparent',
                boxShadow: 'none',
                color: 'text.primary',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    bgcolor: alpha('#FFFFFF', 0.8),
                    zIndex: -1,
                },
            }}
        >
            <Toolbar sx={{ height: { xs: 64, md: 72 } }}>
                {/* Mobile Menu Button */}
                {showMenuButton && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onMenuClick}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <Icon icon="solar:hamburger-menu-line-duotone" width={24} />
                    </IconButton>
                )}

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Right Side Icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    {/* Search */}
                    {searchOpen ? (
                        <InputBase
                            autoFocus
                            placeholder="Search…"
                            onBlur={() => setSearchOpen(false)}
                            sx={{
                                px: 2,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: alpha('#919EAB', 0.08),
                                width: { xs: 180, sm: 260 },
                            }}
                        />
                    ) : (
                        <IconButton onClick={() => setSearchOpen(true)} sx={{ color: 'text.secondary' }}>
                            <Icon icon="eva:search-fill" width={20} />
                        </IconButton>
                    )}

                    {/* Language */}
                    <IconButton sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}>
                        <Icon icon="icon-park-solid:english" width={20} />
                    </IconButton>

                    {/* Notifications */}
                    <NotificationsPopover sx={{ color: 'text.secondary' }} />

                    {/* Account */}
                    <AccountPopover />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
