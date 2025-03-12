"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth"
import styles from "./auth-modal.module.css"

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: "API",
  authDomain: "API",
  projectId: "API",
  storageBucket: "API",
  messagingSenderId: "API",
  appId: "API",
  measurementId: "API",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  console.log("AuthModal rendered with isOpen:", isOpen, "initialMode:", initialMode)

  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    console.log("AuthModal useEffect running, setting mounted to true")
    // Set mounted to true when component mounts on client
    setMounted(true)

    // Get the portal element
    if (typeof document !== "undefined") {
      setPortalElement(document.body)
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, user:", user ? "logged in" : "not logged in")
      setCurrentUser(user)
      if (user) {
        // User is signed in, close the modal
        onClose()
      }
    })

    return () => unsubscribe()
  }, [onClose])

  useEffect(() => {
    // Reset form when mode changes
    setError(null)
    setEmail("")
    setPassword("")
  }, [mode])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Auth state listener will handle closing the modal
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // Auth state listener will handle closing the modal
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      await signInWithPopup(auth, googleProvider)
      // Auth state listener will handle closing the modal
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (err: any) {
      console.error("Error signing out:", err)
    }
  }

  if (!mounted) {
    console.log("AuthModal not mounted yet, returning null")
    return null
  }

  // If not open, don't render anything
  if (!isOpen) {
    console.log("AuthModal isOpen is false, returning null")
    return null
  }

  if (!portalElement) {
    console.log("Portal element not available yet")
    return null
  }

  console.log("AuthModal rendering content, currentUser:", currentUser ? "exists" : "null")

  // If user is logged in, show profile info
  if (currentUser) {
    return createPortal(
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
          <div className={styles.header}>
            <h2>Your Profile</h2>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileInfo}>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p>
                <strong>User ID:</strong> {currentUser.uid.substring(0, 8)}...
              </p>
            </div>
            <button className={styles.signOutButton} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>,
      portalElement,
    )
  }

  // Otherwise, show login/signup form
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={mode === "login" ? handleEmailSignIn : handleEmailSignUp}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {mode === "login" && (
            <div className={styles.forgotPassword}>
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className={styles.primaryButton} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button className={styles.googleButton} onClick={handleGoogleSignIn} disabled={loading}>
          <svg viewBox="0 0 24 24" width="18" height="18">
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
          <span>Continue with Google</span>
        </button>

        <div className={styles.switchMode}>
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>,
    portalElement,
  )
}

