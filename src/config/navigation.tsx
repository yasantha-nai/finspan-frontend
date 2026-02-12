import { Icon } from '@iconify/react';
import type { NavItem } from '@/components/layout/NavSidebar';

export const navConfig: NavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Icon icon="solar:pie-chart-2-bold-duotone" width={24} />,
    },
    {
        title: 'Simulation',
        path: '/simulation-results',
        icon: <Icon icon="solar:chart-2-bold-duotone" width={24} />,
    },
    {
        title: 'Input Data',
        path: '/input-data',
        icon: <Icon icon="solar:widget-3-bold-duotone" width={24} />,
    },
    {
        title: 'Reports',
        path: '/reports',
        icon: <Icon icon="solar:document-text-bold-duotone" width={24} />,
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Icon icon="solar:settings-bold-duotone" width={24} />,
    },
];
