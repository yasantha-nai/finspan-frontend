import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { alpha } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/AuthContext';

// ----------------------------------------------------------------------

// Mock data
const _myAccount = {
    displayName: 'Yasantha Rajakaruna',
    email: 'yasantha@gmail.com',
    photoURL: '/assets/images/avatar/avatar_25.jpg',
};

const MENU_OPTIONS = [
    {
        label: 'Home',
        href: '/dashboard',
        icon: <Icon icon="solar:home-angle-bold-duotone" width={24} />,
    },
    {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: <Icon icon="solar:user-id-bold-duotone" width={24} />,
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: <Icon icon="solar:settings-bold-duotone" width={24} />,
    },
];

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
    data?: {
        label: string;
        href: string;
        icon?: React.ReactNode;
        info?: React.ReactNode;
    }[];
};

export function AccountPopover({ data = MENU_OPTIONS, sx, ...other }: AccountPopoverProps) {
    const navigate = useNavigate();
    const { logout, user, userProfile } = useAuth();
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const account = {
        displayName: user?.displayName || (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'),
        email: user?.email || '',
        photoURL: user?.photoURL || '',
        initial: (user?.displayName || userProfile?.firstName || 'U').charAt(0).toUpperCase()
    };

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleClickItem = useCallback(
        (path: string) => {
            handleClosePopover();
            navigate(path);
        },
        [handleClosePopover, navigate]
    );

    return (
        <>
            <IconButton
                onClick={handleOpenPopover}
                sx={{
                    p: '2px',
                    width: 40,
                    height: 40,
                    background: (theme) =>
                        `conic-gradient(${theme.palette.primary.light}, ${theme.palette.warning.light}, ${theme.palette.primary.light})`,
                    ...sx,
                }}
                {...other}
            >
                <Avatar
                    src={account.photoURL}
                    alt={account.displayName}
                    sx={{
                        width: 1,
                        height: 1,
                        bgcolor: 'action.selected',
                    }}
                >
                    {account.initial}
                </Avatar>
            </IconButton>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: { width: 200 },
                    },
                }}
            >
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {account.displayName}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {account.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuList
                    disablePadding
                    sx={{
                        p: 1,
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            color: 'text.secondary',
                            '&:hover': { color: 'text.primary' },
                            [`&.${menuItemClasses.selected}`]: {
                                color: 'text.primary',
                                bgcolor: 'action.selected',
                                fontWeight: 'fontWeightSemiBold',
                            },
                        },
                    }}
                >
                    {data.map((option) => (
                        <MenuItem
                            key={option.label}
                            onClick={() => handleClickItem(option.href)}
                        >
                            {option.icon}
                            {option.label}
                        </MenuItem>
                    ))}
                </MenuList>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button
                        fullWidth
                        color="error"
                        size="medium"
                        variant="text"
                        onClick={async () => {
                            handleClosePopover();
                            await logout();
                            navigate('/login');
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Popover>
        </>
    );
}
