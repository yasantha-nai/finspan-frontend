import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
    }
    interface PaletteColor {
        lighter?: string;
        darker?: string;
    }
    interface SimplePaletteColorOptions {
        lighter?: string;
        darker?: string;
    }
    interface TypeBackground {
        neutral: string;
    }
}

export const muiTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            lighter: '#C8FAD6',
            light: '#5BE49B',
            main: '#00A76F',
            dark: '#007867',
            darker: '#004B50',
            contrastText: '#FFFFFF',
        },
        secondary: {
            lighter: '#EFD6FF',
            light: '#C684FF',
            main: '#8E33FF',
            dark: '#5119B7',
            darker: '#27097A',
            contrastText: '#FFFFFF',
        },
        info: {
            lighter: '#CAFDF5',
            light: '#61F3F3',
            main: '#00B8D9',
            dark: '#006C9C',
            darker: '#003768',
            contrastText: '#FFFFFF',
        },
        success: {
            lighter: '#D3FCD2',
            light: '#77ED8B',
            main: '#22C55E',
            dark: '#118D57',
            darker: '#065E49',
            contrastText: '#FFFFFF',
        },
        warning: {
            lighter: '#FFF5CC',
            light: '#FFD666',
            main: '#FFAB00',
            dark: '#B76E00',
            darker: '#7A4100',
            contrastText: '#1C252E',
        },
        error: {
            lighter: '#FFE9D5',
            light: '#FFAC82',
            main: '#FF5630',
            dark: '#B71D18',
            darker: '#7A0916',
            contrastText: '#FFFFFF',
        },
        grey: {
            100: '#F9FAFB',
            200: '#F4F6F8',
            300: '#DFE3E8',
            400: '#C4CDD5',
            500: '#919EAB',
            600: '#637381',
            700: '#454F5B',
            800: '#1C252E',
            900: '#141A21',
        },
        text: {
            primary: '#212B36',
            secondary: '#637381',
            disabled: '#919EAB',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
            neutral: '#F4F6F8',
        },
        action: {
            hover: alpha('#919EAB', 0.08),
            selected: alpha('#919EAB', 0.16),
            disabled: alpha('#919EAB', 0.8),
            disabledBackground: alpha('#919EAB', 0.24),
            focus: alpha('#919EAB', 0.24),
            hoverOpacity: 0.08,
            disabledOpacity: 0.48,
        },
    },
    typography: {
        fontFamily: "'Public Sans', sans-serif",
        h1: { fontWeight: 800, lineHeight: 80 / 64, fontSize: '4rem' },
        h2: { fontWeight: 800, lineHeight: 64 / 48, fontSize: '3rem' },
        h3: { fontWeight: 700, lineHeight: 1.5, fontSize: '2rem' },
        h4: { fontWeight: 700, lineHeight: 1.5, fontSize: '1.5rem' },
        h5: { fontWeight: 700, lineHeight: 1.5, fontSize: '1.25rem' },
        h6: { fontWeight: 700, lineHeight: 28 / 18, fontSize: '1.125rem' },
        subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: '1rem' },
        subtitle2: { fontWeight: 600, lineHeight: 22 / 14, fontSize: '0.875rem' },
        body1: { lineHeight: 1.5, fontSize: '1rem' },
        body2: { lineHeight: 22 / 14, fontSize: '0.875rem' },
        caption: { lineHeight: 1.5, fontSize: '0.75rem' },
        overline: { fontWeight: 700, lineHeight: 1.5, fontSize: '0.75rem', textTransform: 'uppercase' },
        button: { fontWeight: 700, lineHeight: 24 / 14, fontSize: '0.875rem', textTransform: 'unset' },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 1px 2px 0px rgba(145, 158, 171, 0.16)',
        '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
        '0px 12px 24px -4px rgba(145, 158, 171, 0.16)',
        '0px 16px 32px -4px rgba(145, 158, 171, 0.16)',
        '0px 20px 40px -4px rgba(145, 158, 171, 0.16)',
        ...Array(19).fill('none'),
    ] as any,
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
                    borderRadius: 16,
                    position: 'relative',
                    zIndex: 0,
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    padding: 24,
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 24,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 12, // Standardized 12px
                },
                sizeLarge: {
                    height: 54,
                    borderRadius: 12,
                    padding: '0 24px',
                },
                sizeMedium: {
                    height: 44,
                    borderRadius: 10,
                },
                sizeSmall: {
                    height: 32,
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        height: 54, // Match large button height
                        borderRadius: 12,
                        backgroundColor: '#F9FAFB',
                        '& fieldset': {
                            borderColor: alpha('#919EAB', 0.2),
                        },
                        '&:hover fieldset': {
                            borderColor: '#212B36',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00A76F',
                        },
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    height: 54,
                    borderRadius: 12,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});
