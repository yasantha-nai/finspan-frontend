import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    Link,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Divider,
    Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Visibility, VisibilityOff, Code } from "@mui/icons-material";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
    const { login, googleLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/dashboard";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const username = inputs.username.trim();
        const password = inputs.password.trim();

        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error(err);
            setError("Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            console.log('🔐 Starting Google login...');
            await googleLogin();
            console.log('✅ Google login successful');
            
            // In dev mode, use hard redirect to ensure navigation works
            if (import.meta.env.DEV) {
                console.log('🔄 Dev mode: Hard redirecting to dashboard');
                window.location.href = '/dashboard';
            } else {
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            console.error('❌ Google login error:', err);
            // Better error messages
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Login cancelled. Please try again.");
            } else if (err.code === 'auth/popup-blocked') {
                setError("Popup blocked. Please allow popups for this site.");
            } else if (err.code === 'auth/network-request-failed') {
                setError("Network error. Please check your connection.");
            } else {
                setError(err.message || "Google login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDevLogin = async () => {
        setInputs({ username: "admin@finspan.com", password: "@Admin123" });
    };

    return (
        <AuthLayout
            title="Seamless & Secure Access"
            subtitle="Your financial journey is protected by advanced encryption and identity verification."
        >
            <Stack spacing={5} sx={{ width: "100%", maxWidth: 420 }}>
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "#212B36" }}>
                        Sign in to your account
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/register"
                            underline="hover"
                            variant="subtitle2"
                            sx={{ color: "#00A76F", fontWeight: 600 }}
                        >
                            Get started
                        </Link>
                    </Stack>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email address"
                        name="username"
                        value={inputs.username}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="admin@finspan.com"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": { borderColor: "#212B36" },
                            }
                        }}
                    />

                    <Box>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 1 }}>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
                                variant="body2"
                                underline="hover"
                                color="text.secondary"
                            >
                                Forgot password?
                            </Link>
                        </Stack>
                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={inputs.password}
                            onChange={handleChange}
                            label="Password"
                            placeholder="Password"
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&.Mui-focused fieldset": { borderColor: "#212B36" },
                                }
                            }}
                        />
                    </Box>

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        sx={{
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: '1rem',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
                            "&:hover": {
                                boxShadow: '0 12px 20px 0 rgba(0, 167, 111, 0.32)',
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>

                    {/* DEV MODE QUICK LOGIN */}
                    {import.meta.env.DEV && (
                        <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={handleDevLogin}
                            startIcon={<Code />}
                            sx={{ mt: 1, borderStyle: 'dashed' }}
                        >
                            Dev: Auto-Fill Admin
                        </Button>
                    )}
                </Stack>

                <Divider sx={{ my: 3, typography: 'body2', color: 'text.disabled' }}>OR</Divider>

                <Stack spacing={2}>
                    <Button
                        fullWidth
                        size="large"
                        color="inherit"
                        variant="outlined"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        startIcon={<Icon icon="logos:google-icon" width={24} />}
                        sx={{
                            py: 1.25,
                            borderColor: 'rgba(145, 158, 171, 0.2)',
                            color: 'text.primary',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            "&:hover": {
                                bgcolor: 'rgba(145, 158, 171, 0.08)',
                                borderColor: 'rgba(145, 158, 171, 0.32)',
                            }
                        }}
                    >
                        {isLoading ? "Signing in..." : "Continue with Google"}
                    </Button>

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <IconButton disabled sx={{ color: 'text.disabled', opacity: 0.48 }}>
                            <Icon icon="logos:facebook" width={24} />
                        </IconButton>
                        <IconButton disabled sx={{ color: 'text.disabled', opacity: 0.48 }}>
                            <Icon icon="logos:apple-api" width={24} />
                        </IconButton>
                        <IconButton disabled sx={{ color: 'text.disabled', opacity: 0.48 }}>
                            <Icon icon="ri:twitter-x-fill" width={24} color="#000" />
                        </IconButton>
                    </Stack>
                    <Typography variant="caption" align="center" sx={{ color: 'text.disabled', mt: -1 }}>
                        More social login options coming soon
                    </Typography>
                </Stack>
            </Stack>
        </AuthLayout>
    );
};

export default LoginPage;
