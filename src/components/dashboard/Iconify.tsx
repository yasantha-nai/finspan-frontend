import { Icon, IconifyIcon } from '@iconify/react';

type IconifyProps = {
    icon: IconifyIcon | string;
    width?: number | string;
    sx?: any;
};

export function Iconify({ icon, width = 20, sx, ...other }: IconifyProps) {
    return (
        <Icon
            icon={icon}
            width={width}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof width === 'number' ? `${width}px` : width,
                ...sx,
            }}
            {...other}
        />
    );
}
