/**
 * Professional animation variants for onboarding flow
 * Inspired by Apple's smooth, fluid animations
 */

// Apple-standard easing curve
export const appleEasing = [0.4, 0.0, 0.2, 1];

// Spring configuration for natural motion
export const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
};

// Smooth spring for gentle animations
export const smoothSpring = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
};

// Page transition variants
export const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 30 : -30,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 30 : -30,
        opacity: 0,
    }),
};

export const pageTransition = {
    ...springConfig,
    duration: 0.4,
};

// Stagger container for sequential animations
export const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

// Individual item animations
export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: smoothSpring,
    },
};

// Icon animation with subtle bounce
export const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 20,
            bounce: 0.3,
        },
    },
};

// Button micro-interactions
export const buttonHoverVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.15,
            ease: appleEasing,
        },
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.1,
            ease: appleEasing,
        },
    },
};

// Progress bar smooth transition
export const progressVariants = {
    initial: { scaleX: 0, originX: 0 },
    animate: (progress: number) => ({
        scaleX: progress / 100,
        transition: {
            duration: 0.5,
            ease: "easeInOut",
        },
    }),
};
