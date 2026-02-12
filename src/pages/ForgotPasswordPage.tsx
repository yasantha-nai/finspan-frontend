import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Box,
    Button,
    Link,
    Stack,
    TextField,
    Typography,
    Alert,
    IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import AuthLayout, { RecoveryIllustration } from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthContext";

const ForgotPasswordPage = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email.trim());
            setIsSent(true);
        } catch (err: any) {
            console.error(err);
            setError("Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Account Recovery"
            subtitle="Securely restore access to your financial cockpit with just a few steps."
            illustration={<RecoveryIllustration />}
        >
            <Stack spacing={4} sx={{ width: "100%", maxWidth: 420, alignItems: "center", textAlign: "center" }}>
                {/* Illustration/Icon */}
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "rgba(0, 167, 111, 0.12)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#00A76F",
                        mb: 2,
                    }}
                >
                    <Icon icon="solar:lock-password-bold-duotone" width={48} />
                </Box>

                <Stack spacing={1}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "#212B36" }}>
                        Forgot your password?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please enter the email address associated with your account and we'll email you a link to reset your password.
                    </Typography>
                </Stack>

                {error && <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>{error}</Alert>}
                {isSent && (
                    <Alert severity="success" sx={{ width: '100%', textAlign: 'left' }}>
                        Password reset email has been sent to <strong>{email}</strong>.
                    </Alert>
                )}

                <Stack component="form" spacing={3} noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Email address"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || isSent}
                        placeholder="example@gmail.com"
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
                        disabled={isLoading || isSent}
                        sx={{
                            bgcolor: "#212B36",
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
                        {isLoading ? "Sending request..." : "Send request"}
                    </Button>

                    <Link
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        variant="subtitle2"
                        sx={{
                            color: "#212B36",
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5
                        }}
                    >
                        <Icon icon="solar:alt-arrow-left-outline" width={18} />
                        Return to sign in
                    </Link>
                </Stack>
            </Stack>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
