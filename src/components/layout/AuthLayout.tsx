import { Box, Grid, Stack, Typography, Avatar } from "@mui/material";
import { Icon } from "@iconify/react";
import LandingHeader from "@/components/landing/LandingHeader";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/theme/mui-theme";
import { motion } from "framer-motion";

// --- Base Illustration Components ---

interface IllustrationWrapperProps {
    children: React.ReactNode;
}

const IllustrationWrapper = ({ children }: IllustrationWrapperProps) => (
    <Box
        sx={{
            width: "100%",
            height: "100%",
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            perspective: "1200px",
        }}
    >
        {children}

        {/* Decorative Background Elements */}
        <Box
            sx={{
                position: "absolute",
                top: "20%",
                left: "10%",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0, 166, 119, 0.08) 0%, transparent 70%)",
                zIndex: 1
            }}
        />
        <Box
            sx={{
                position: "absolute",
                bottom: "15%",
                right: "10%",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(33, 47, 61, 0.05) 0%, transparent 70%)",
                zIndex: 1
            }}
        />

        <style>
            {`
            @keyframes bounce {
                0%, 100% { transform: translateY(0) rotate(15deg); }
                50% { transform: translateY(-8px) rotate(15deg); }
            }
            @keyframes pulse-soft {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.05); opacity: 1; }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            `}
        </style>
    </Box>
);

const CardBase = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            position: "relative",
            width: "480px",
            height: "360px",
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: "0 60px 120px -18px rgba(0, 0, 0, 0.18)",
            border: "1px solid rgba(145, 158, 171, 0.12)",
            p: 5,
            display: "flex",
            flexDirection: "column",
            transform: "rotateY(-10deg) rotateX(4deg)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 2,
            "&:hover": {
                transform: "rotateY(0deg) rotateX(0deg) scale(1.02)",
            }
        }}
    >
        {children}
    </Box>
);

// --- Specific Illustrations ---

export const LoginIllustration = () => (
    <IllustrationWrapper>
        <CardBase>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
                <Box sx={{
                    width: 56, height: 56, borderRadius: 2, bgcolor: "rgba(0, 166, 119, 0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#00A677"
                }}>
                    <Icon icon="solar:shield-check-bold-duotone" width={40} />
                </Box>
                <Typography variant="h5" sx={{ color: "#212F3D", fontWeight: 700 }}>Secure Access</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', mr: 6 }}>
                    <Avatar sx={{ width: 96, height: 96, bgcolor: "rgba(33, 47, 61, 0.08)", color: "#212F3D", border: '3px solid #fff', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}>
                        <Icon icon="solar:user-bold-duotone" width={56} />
                    </Avatar>
                    <Box sx={{
                        position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, bgcolor: "#00A677",
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        border: '4px solid #fff', boxShadow: '0 0 16px rgba(0, 166, 119, 0.5)', zIndex: 2
                    }}>
                        <Icon icon="solar:check-read-linear" width={24} />
                    </Box>
                </Box>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ color: "#00A677", transform: 'rotate(-10deg)' }}>
                        <Icon icon="solar:lock-password-unlocked-bold-duotone" width={110} />
                    </Box>
                    <Box sx={{
                        position: 'absolute', top: 28, right: -32, color: "#FFC107",
                        filter: 'drop-shadow(0 6px 12px rgba(255, 193, 7, 0.5))', transform: 'rotate(15deg)', animation: 'bounce 2s infinite ease-in-out'
                    }}>
                        <Icon icon="solar:key-bold-duotone" width={56} />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Identity Verified</Typography>
                    <Typography variant="subtitle2" sx={{ color: '#00A677', fontWeight: 700 }}>100%</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(33, 47, 61, 0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ width: '100%', height: '100%', bgcolor: '#00A677', borderRadius: 2, boxShadow: '0 0 12px rgba(0, 166, 119, 0.3)' }} />
                </Box>
            </Box>
        </CardBase>
    </IllustrationWrapper>
);

export const SignupIllustration = () => (
    <IllustrationWrapper>
        <CardBase>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
                <Box sx={{
                    width: 56, height: 56, borderRadius: 2, bgcolor: "rgba(0, 166, 119, 0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#00A677"
                }}>
                    <Icon icon="solar:rocket-bold-duotone" width={40} />
                </Box>
                <Typography variant="h5" sx={{ color: "#212F3D", fontWeight: 700 }}>Start Your Journey</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{
                    width: 120, height: 120, borderRadius: '50%', border: '4px dashed rgba(0, 166, 119, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1, animation: 'float 3s infinite ease-in-out'
                }}>
                    <Box sx={{
                        width: '100%', height: '100%', borderRadius: '50%', bgcolor: 'rgba(0, 166, 119, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A677'
                    }}>
                        <Icon icon="solar:compass-bold-duotone" width={64} />
                    </Box>
                </Box>
                <Box sx={{ position: 'absolute', top: -10, right: 60, color: '#FFAB00', animation: 'bounce 2.5s infinite' }}>
                    <Icon icon="solar:star-bold-duotone" width={32} />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 20, left: 40, color: '#FF5630', animation: 'bounce 3s infinite' }}>
                    <Icon icon="solar:box-bold-duotone" width={28} />
                </Box>
            </Box>

            <Box sx={{ mt: 6 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5 }}>Ready for Liftoff</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {[1, 2, 3, 4].map(i => (
                        <Box key={i} sx={{
                            height: 8, flex: 1, borderRadius: 2,
                            bgcolor: i <= 1 ? '#00A677' : 'rgba(33, 47, 61, 0.06)',
                            boxShadow: i <= 1 ? '0 0 8px rgba(0, 166, 119, 0.3)' : 'none'
                        }} />
                    ))}
                </Box>
            </Box>
        </CardBase>
    </IllustrationWrapper>
);

export const RecoveryIllustration = () => (
    <IllustrationWrapper>
        <CardBase>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
                <Box sx={{
                    width: 56, height: 56, borderRadius: 2, bgcolor: "rgba(255, 171, 0, 0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#FFAB00"
                }}>
                    <Icon icon="solar:shield-warning-bold-duotone" width={40} />
                </Box>
                <Typography variant="h5" sx={{ color: "#212F3D", fontWeight: 700 }}>Restore Access</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{
                    width: 140, height: 140, borderRadius: 3, bgcolor: 'rgba(33, 47, 61, 0.03)',
                    border: '1px solid rgba(145, 158, 171, 0.12)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transform: 'rotate(-5deg)'
                }}>
                    <Box sx={{ color: '#212B36', opacity: 0.1 }}>
                        <Icon icon="solar:user-id-bold-duotone" width={100} />
                    </Box>
                    <Box sx={{
                        position: 'absolute', color: '#FFAB00', animation: 'pulse-soft 2s infinite ease-in-out',
                        filter: 'drop-shadow(0 0 12px rgba(255, 171, 0, 0.3))'
                    }}>
                        <Icon icon="solar:magnifer-bold-duotone" width={72} />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: 6 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5 }}>Searching for Profile</Typography>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(33, 47, 61, 0.06)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{
                        width: '40%', height: '100%', bgcolor: '#FFAB00', borderRadius: 2,
                        position: 'absolute', left: 0, animation: 'loading-scan 1.5s infinite linear'
                    }} />
                </Box>
                <style>{`
                    @keyframes loading-scan {
                        0% { left: -40%; }
                        100% { left: 100%; }
                    }
                `}</style>
            </Box>
        </CardBase>
    </IllustrationWrapper>
);

// --- Main Layout ---

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    illustration?: React.ReactNode;
}

const AuthLayout = ({
    children,
    title = "Seamless & Secure Access",
    subtitle = "Experience our premium financial navigator with confidence.",
    illustration = <LoginIllustration />
}: AuthLayoutProps) => {
    return (
        <ThemeProvider theme={muiTheme}>
            <LandingHeader />
            <Grid container sx={{ minHeight: "100vh", pt: { xs: 8, md: 0 } }}>
                {/* Left Column */}
                <Grid
                    size={{ xs: 12, md: 7 }}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        justifyContent: "center",
                        bgcolor: "#F9FAFB",
                        p: 4,
                        pt: 12,
                    }}
                >
                    <Stack spacing={8} sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
                        {/* Headings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <Stack spacing={2} sx={{ width: '100%', alignItems: 'flex-start' }}>
                                <Typography variant="h3" fontWeight={700} sx={{ color: "#212B36", lineHeight: 1.2 }}>
                                    {title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                                    {subtitle}
                                </Typography>
                            </Stack>
                        </motion.div>

                        {/* Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            style={{ width: "100%" }}
                        >
                            <Box sx={{ width: "100%" }}>
                                {illustration}
                            </Box>
                        </motion.div>

                        {/* Footer Logos */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            <Stack direction="row" spacing={4}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'text.disabled', borderRadius: '50%' }} />
                                <Box sx={{ width: 24, height: 24, bgcolor: 'text.disabled', borderRadius: 0, transform: 'rotate(45deg)' }} />
                                <Box sx={{ width: 24, height: 24, bgcolor: 'text.disabled', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                                <Box sx={{ width: 24, height: 24, bgcolor: 'text.disabled', borderRadius: 0.5 }} />
                                <Box sx={{ width: 24, height: 24, bgcolor: 'text.disabled', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                            </Stack>
                        </motion.div>
                    </Stack>
                </Grid>

                {/* Right Column - Form */}
                <Grid
                    size={{ xs: 12, md: 5 }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 4,
                        bgcolor: "background.paper",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {children}
                    </motion.div>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default AuthLayout;
