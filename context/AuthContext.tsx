import React, { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../config/FirebaseConfig"; // Adjust path if necessary
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

// Define the context type
interface AuthContextType {
  user: User | null; // Current authenticated user
  loading: boolean; // Loading state
  signIn: (email: string, password: string) => Promise<void>; // Sign-in method
  signOutUser: () => Promise<void>; // Sign-out method
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Observe authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      setUser(currentUser); // If user is logged in, user will be set
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign-in method
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sign-out method
  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Provide the context value
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
