import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthLayout, { SignupIllustration } from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthContext";

const SignupPage = () => {
    const { register, googleLogin } = useAuth(); // Auth Hook
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!inputs.email || !inputs.password || !inputs.firstName || !inputs.lastName) {
            setError("All fields are required.");
            return;
        }

        setIsLoading(true);
        try {
            await register(inputs.email, inputs.password, inputs.firstName, inputs.lastName);
            // Onboarding automatically handled by ProtectedRoute
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already registered.");
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Google signup failed.");
        }
    };

    return (
        <AuthLayout
            title="Start Your Journey"
            subtitle="Transform your financial vision into a clear, actionable roadmap today."
            illustration={<SignupIllustration />}
        >
            <Stack spacing={4} sx={{ width: "100%", maxWidth: 480 }}>
                {/* Header Section */}
                <Stack spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "#212B36" }}>
                        Get started absolutely free
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/login"
                            underline="hover"
                            variant="subtitle2"
                            sx={{ color: "#00A76F", fontWeight: 600 }}
                        >
                            Sign in
                        </Link>
                    </Stack>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit}>
                    {/* Name Fields Row */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            fullWidth
                            label="First name"
                            name="firstName"
                            value={inputs.firstName}
                            onChange={handleChange}
                            disabled={isLoading}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&.Mui-focused fieldset": { borderColor: "#212B36" },
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Last name"
                            name="lastName"
                            value={inputs.lastName}
                            onChange={handleChange}
                            disabled={isLoading}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&.Mui-focused fieldset": { borderColor: "#212B36" },
                                }
                            }}
                        />
                    </Stack>

                    <TextField
                        fullWidth
                        label="Email address"
                        name="email"
                        type="email"
                        value={inputs.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": { borderColor: "#212B36" },
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={inputs.password}
                        onChange={handleChange}
                        placeholder="6+ characters"
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

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        sx={{
                            bgcolor: "#212B36", // Dark button color as per design
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: '1rem',
                            borderRadius: '8px',
                            py: 1.5,
                            "&:hover": {
                                bgcolor: "#454F5B",
                            },
                        }}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>

                    <Typography variant="caption" align="center" sx={{ color: "text.secondary", px: 2 }}>
                        By signing up, I agree to{" "}
                        <Link underline="always" color="text.primary" href="#" sx={{ fontWeight: 600 }}>
                            Terms of service
                        </Link>{" "}
                        and{" "}
                        <Link underline="always" color="text.primary" href="#" sx={{ fontWeight: 600 }}>
                            Privacy policy
                        </Link>
                        .
                    </Typography>
                </Stack>

                <Divider sx={{ my: 3, typography: 'body2', color: 'text.disabled' }}>OR</Divider>

                {/* Social Login Buttons - Using a prominent button for consistency */}
                <Stack spacing={2}>
                    <Button
                        fullWidth
                        size="large"
                        color="inherit"
                        variant="outlined"
                        onClick={handleGoogleLogin}
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
                        Continue with Google
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

export default SignupPage;
