import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

type NotificationItemProps = {
    id: string;
    type: string;
    title: string;
    isUnRead: boolean;
    description: string;
    avatarUrl: string | null;
    postedAt: Date | string | number;
};

// Mock Data
const NOTIFICATIONS: NotificationItemProps[] = [
    {
        id: '1',
        title: 'New Simulation Completed',
        description: 'Your "Early Retirement" scenario has finished processing.',
        avatarUrl: null,
        type: 'order-placed',
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isUnRead: true,
    },
    {
        id: '2',
        title: 'Market Alert',
        description: 'S&P 500 up by 2% - Impact on your portfolio calculated.',
        avatarUrl: '/assets/icons/ic_notification_chat.svg',
        type: 'chat-message',
        postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isUnRead: true,
    },
    {
        id: '3',
        title: 'Goal Reached!',
        description: 'You have hit 50% of your savings target.',
        avatarUrl: null,
        type: 'mail',
        postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isUnRead: false,
    },
    {
        id: '4',
        title: 'Monthly Report Available',
        description: 'Your financial summary for September is ready.',
        avatarUrl: null,
        type: 'mail',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isUnRead: false,
    },
    {
        id: '5',
        title: 'New Feature: Tax Optimization',
        description: 'Check out the new tax saving strategies module.',
        avatarUrl: null,
        type: 'order-placed',
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isUnRead: false,
    },
];

export type NotificationsPopoverProps = IconButtonProps & {
    data?: NotificationItemProps[];
};

export function NotificationsPopover({ data = NOTIFICATIONS, sx, ...other }: NotificationsPopoverProps) {
    const [notifications, setNotifications] = useState(data);

    const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleMarkAllAsRead = useCallback(() => {
        const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            isUnRead: false,
        }));

        setNotifications(updatedNotifications);
    }, [notifications]);

    return (
        <>
            <IconButton
                color={openPopover ? 'primary' : 'default'}
                onClick={handleOpenPopover}
                sx={sx}
                {...other}
            >
                <Badge badgeContent={totalUnRead} color="error">
                    <Icon width={24} icon="solar:bell-bing-bold-duotone" />
                </Badge>
            </IconButton>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 360,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        py: 2,
                        pl: 2.5,
                        pr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">Notifications</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            You have {totalUnRead} unread messages
                        </Typography>
                    </Box>

                    {totalUnRead > 0 && (
                        <Tooltip title=" Mark all as read">
                            <IconButton color="primary" onClick={handleMarkAllAsRead}>
                                <Icon icon="eva:done-all-fill" width={24} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ maxHeight: { xs: 360, sm: 400 }, overflow: 'auto' }}>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                                New
                            </ListSubheader>
                        }
                    >
                        {notifications.slice(0, 2).map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </List>

                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                                Before that
                            </ListSubheader>
                        }
                    >
                        {notifications.slice(2, 5).map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </List>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button fullWidth disableRipple color="inherit">
                        View all
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
    const { avatarUrl, title } = renderContent(notification);

    return (
        <ListItemButton
            sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(notification.isUnRead && {
                    bgcolor: 'action.selected',
                }),
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            gap: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                        }}
                    >
                        <Icon width={14} icon="solar:clock-circle-outline" />
                        {formatDistanceToNow(new Date(notification.postedAt), { addSuffix: true })}
                    </Typography>
                }
            />
        </ListItemButton>
    );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
    const title = (
        <Typography variant="subtitle2">
            {notification.title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                &nbsp; {notification.description}
            </Typography>
        </Typography>
    );

    // Fallback icons if images are missing
    const OrderPlacedIcon = <Icon icon="solar:box-minimalistic-bold-duotone" width={24} color="#00B8D9" />;
    const OrderShippedIcon = <Icon icon="solar:delivery-bold-duotone" width={24} color="#FF5630" />;
    const MailIcon = <Icon icon="solar:letter-bold-duotone" width={24} color="#FFAB00" />;
    const ChatIcon = <Icon icon="solar:chat-round-dots-bold-duotone" width={24} color="#36B37E" />;

    if (notification.type === 'order-placed') {
        return {
            avatarUrl: OrderPlacedIcon,
            title,
        };
    }
    if (notification.type === 'order-shipped') {
        return {
            avatarUrl: OrderShippedIcon,
            title,
        };
    }
    if (notification.type === 'mail') {
        return {
            avatarUrl: MailIcon,
            title,
        };
    }
    if (notification.type === 'chat-message') {
        return {
            avatarUrl: ChatIcon,
            title,
        };
    }
    return {
        avatarUrl: notification.avatarUrl ? (
            <img alt={notification.title} src={notification.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null,
        title,
    };
}
