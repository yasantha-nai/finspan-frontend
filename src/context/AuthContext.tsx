import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

// Define the shape of our user profile in Firestore
export interface UserProfile {
    uid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    onboardingCompleted: boolean;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean; // Initial loading state (checking auth)
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string, first: string, last: string) => Promise<void>;
    logout: () => Promise<void>;
    googleLogin: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    // Dev Mode Helpers
    dev_forceNewUser: () => Promise<void>;
    dev_resetOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial Auth Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchUserProfile(currentUser.uid);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserProfile = async (uid: string) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
            } else {
                // If auth exists but no profile (edge case), create a default one
                console.warn("User exists in Auth but not Firestore. Creating default profile.");
                const newProfile: UserProfile = {
                    uid,
                    email: auth.currentUser?.email || "",
                    onboardingCompleted: false,
                    createdAt: new Date().toISOString()
                };
                await setDoc(docRef, newProfile);
                setUserProfile(newProfile);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const register = async (email: string, pass: string, first: string, last: string) => {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        // Create user profile in Firestore
        const newProfile: UserProfile = {
            uid: res.user.uid,
            email,
            firstName: first,
            lastName: last,
            onboardingCompleted: false, // Default to false for new users
            createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", res.user.uid), newProfile);
        setUserProfile(newProfile);
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        // Check if profile exists, if not create it
        const docRef = doc(db, "users", res.user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            const newProfile: UserProfile = {
                uid: res.user.uid,
                email: res.user.email || "",
                firstName: res.user.displayName?.split(' ')[0] || "",
                lastName: res.user.displayName?.split(' ').slice(1).join(' ') || "",
                onboardingCompleted: false,
                createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newProfile);
            setUserProfile(newProfile);
        } else {
            setUserProfile(docSnap.data() as UserProfile);
        }
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    const completeOnboarding = async () => {
        if (!user) return;
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { onboardingCompleted: true }, { merge: true });
        // Update local state to reflect change immediately
        setUserProfile(prev => prev ? { ...prev, onboardingCompleted: true } : null);
    };

    const refreshProfile = async () => {
        if (user) await fetchUserProfile(user.uid);
    }

    // --- DEV HELPERS ---
    const dev_forceNewUser = async () => {
        if (!import.meta.env.DEV) return;
        // Mock a "fresh" login state or reset current user
        if (user) {
            await dev_resetOnboarding();
        }
    };

    const dev_resetOnboarding = async () => {
        if (!user) return;
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { onboardingCompleted: false }, { merge: true });
        setUserProfile(prev => prev ? { ...prev, onboardingCompleted: false } : null);
        console.log("DEV: Onboarding reset to false");
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading,
            login,
            register,
            logout,
            googleLogin,
            resetPassword,
            completeOnboarding,
            refreshProfile,
            dev_forceNewUser,
            dev_resetOnboarding
        }}>
            {children}
        </AuthContext.Provider>
    );
};
