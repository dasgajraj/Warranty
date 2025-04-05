"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { signInWithPopup, onAuthStateChanged, type User } from "firebase/auth";
import { auth, googleProvider } from "./firebase-config";
import styles from "./auth-modal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

interface FirebaseError {
  code: string;
  message: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    // Set mounted to true when component mounts on client
    setMounted(true);

    // Get the portal element
    if (typeof document !== "undefined") {
      setPortalElement(document.body);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, show success state briefly
        setAuthSuccess(true);

        // Delay redirection to show success message
        setTimeout(() => {
          onClose();
          // Navigate to dashboard
          window.location.href = "/dashboard";
        }, 1500);
      }
    });

    return () => unsubscribe();
  }, [onClose]);

  useEffect(() => {
    // Reset form when modal is opened
    if (isOpen) {
      setError(null);
      setShowRedirectOption(false);
      setAuthSuccess(false);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async (useRedirect = false) => {
    setError(null);
    setLoading(true);

    try {
      if (useRedirect) {
        // Use redirect-based authentication as fallback
        const { signInWithRedirect } = await import("firebase/auth");
        await signInWithRedirect(auth, googleProvider);
        // No need to handle success - redirect will happen and auth state will be handled on return
      } else {
        // Try popup first
        await signInWithPopup(auth, googleProvider);
        // Auth state listener will handle closing the modal and navigation
      }
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      
      // Type guard to check if the error is a FirebaseError
      const firebaseError = err as FirebaseError;

      // Handle specific error for closed popup
      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Sign-in window was closed. Please try again.");
        // Show the redirect option
        setShowRedirectOption(true);
      } else if (firebaseError.code === "auth/popup-blocked") {
        setError(
          "Pop-up was blocked by your browser. Please try the redirect method."
        );
        setShowRedirectOption(true);
      } else {
        setError(firebaseError.message || "Failed to sign in with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { getRedirectResult } = await import("firebase/auth");
        // Check if we have a redirect result
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect authentication successful");
          // Auth state listener will handle the rest
        }
      } catch (err) {
        console.error("Error handling redirect result:", err);
        setError("Failed to complete sign-in. Please try again.");
      }
    };

    handleRedirectResult();
  }, []);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  if (!mounted) {
    return null;
  }

  // If not open, don't render anything
  if (!isOpen) {
    return null;
  }

  if (!portalElement) {
    return null;
  }

  // Otherwise, show login/signup form
  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2>{initialMode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p>Continue with your Google account</p>
        </div>

        {error && (
          <div className={styles.error} role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {authSuccess ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Authentication Successful!</h3>
            <p>Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <>
            <button
              className={styles.googleButton}
              onClick={() => handleGoogleSignIn(false)}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              <span>
                {loading ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    {initialMode === "signup"
                      ? "Creating account..."
                      : "Signing in..."}
                  </>
                ) : initialMode === "signup" ? (
                  "Create account with Google"
                ) : (
                  "Sign in with Google"
                )}
              </span>
            </button>

            {showRedirectOption && (
              <div className={styles.redirectOption}>
                <p>Having trouble signing in?</p>
                <button
                  className={styles.redirectButton}
                  onClick={() => handleGoogleSignIn(true)}
                  disabled={loading}
                >
                  Use redirect sign-in instead
                </button>
              </div>
            )}
          </>
        )}

        <div className={styles.footer}>
          <p>
            By continuing, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>,
    portalElement
  );
}