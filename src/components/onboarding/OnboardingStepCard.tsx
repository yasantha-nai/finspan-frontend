import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, iconVariants } from './animations';

export interface OnboardingStepCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
    completed?: boolean;
}

export function OnboardingStepCard({
    icon,
    title,
    description,
    children,
    completed = false,
}: OnboardingStepCardProps) {
    const theme = useTheme();

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            <Card
                sx={{
                    borderRadius: '16px',
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                    boxShadow: theme.shadows[1],
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    {/* Icon Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, md: 2 },
                            mb: 3,
                        }}
                    >
                        <motion.div variants={iconVariants}>
                            <Box
                                sx={{
                                    width: { xs: 48, md: 56 },
                                    height: { xs: 48, md: 56 },
                                    borderRadius: '50%',
                                    background: completed
                                        ? 'linear-gradient(135deg, #5BE49B 0%, #00A76F 100%)'
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexShrink: 0,
                                }}
                            >
                                {icon}
                            </Box>
                        </motion.div>
                        <Box sx={{ flex: 1 }}>
                            <motion.div variants={itemVariants}>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    gutterBottom
                                    sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                                >
                                    {title}
                                </Typography>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                    {description}
                                </Typography>
                            </motion.div>
                        </Box>
                    </Box>

                    {/* Content */}
                    <motion.div variants={itemVariants}>
                        <Box>{children}</Box>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
