"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Sun, Moon, Menu, X, Target } from "lucide-react"
import Link from "next/link"
import BlockchainReceiptTransform from "@/app/components/receipt-block-transform-copy"

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  useEffect(() => {
    // Initialize theme based on user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)
    if (prefersDark) document.documentElement.classList.add("dark")
  }, [])

  return (
    <div
      style={{
        color: darkMode ? "#f0f0f0" : "#333",
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: darkMode ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Target
            style={{
              width: "24px",
              height: "24px",
              color: darkMode ? "#ffffff" : "#000000",
            }}
          />
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: darkMode ? "#ffffff" : "#000000",
            }}
          >
            WarrantyVault
          </span>
        </div>

        <div
          style={{
            display: mobileMenuOpen ? "flex" : "flex",
            gap: "2rem",
            "@media (max-width: 768px)": {
              display: mobileMenuOpen ? "flex" : "none",
              flexDirection: "column",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              padding: "1rem",
              backgroundColor: darkMode ? "#121212" : "#ffffff",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <a
            href="#features"
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: darkMode ? "#f0f0f0" : "#333",
              position: "relative",
              textDecoration: "none",
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: darkMode ? "#f0f0f0" : "#333",
              position: "relative",
              textDecoration: "none",
            }}
          >
            How It Works
          </a>
          <a
            href="#benefits"
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: darkMode ? "#f0f0f0" : "#333",
              position: "relative",
              textDecoration: "none",
            }}
          >
            Benefits
          </a>
          <a
            href="#testimonials"
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: darkMode ? "#f0f0f0" : "#333",
              position: "relative",
              textDecoration: "none",
            }}
          >
            Testimonials
          </a>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            onClick={toggleTheme}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
              color: darkMode ? "#f0f0f0" : "#333",
              cursor: "pointer",
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              "@media (max-width: 768px)": {
                display: "none",
              },
            }}
          >
            <button
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "9999px",
                background: "transparent",
                border: `1px solid ${darkMode ? "#ffffff" : "#000000"}`,
                color: darkMode ? "#ffffff" : "#000000",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #000000, #6c63ff)",
                border: "none",
                color: "white",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: darkMode ? "#f0f0f0" : "#333",
              "@media (max-width: 768px)": {
                display: "block",
              },
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8rem 2rem 4rem",
          position: "relative",
          overflow: "hidden",
          "@media (max-width: 768px)": {
            flexDirection: "column",
            textAlign: "center",
          },
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            zIndex: 10,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              marginBottom: "1.5rem",
              background: "linear-gradient(135deg, #000000, #6c63ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
              color: darkMode ? "#ffffff" : "#000000",
              "@media (max-width: 768px)": {
                fontSize: "2.5rem",
              },
            }}
          >
            Blockchain-Powered
            <br />
            Warranty Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "1.25rem",
              color: darkMode ? "#b0b0b0" : "#666",
              marginBottom: "2rem",
            }}
          >
            Secure, immutable, and decentralized warranty records
            <br />
            powered by Hyperledger Fabric and IPFS
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: "flex",
              gap: "1rem",
              "@media (max-width: 768px)": {
                justifyContent: "center",
              },
            }}
          >
            <Link
              href="/dashboard"
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #000000, #6c63ff)",
                border: "none",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Get Started
            </Link>

            <button
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                background: "transparent",
                border: `1px solid ${darkMode ? "#ffffff" : "#000000"}`,
                color: darkMode ? "#ffffff" : "#000000",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Learn More
            </button>
          </motion.div>
        </div>

        <div
          style={{
            position: "relative",
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "@media (max-width: 768px)": {
              width: "100%",
              marginTop: "2rem",
            },
          }}
        >
          <BlockchainReceiptTransform darkMode={darkMode} />
        </div>

        <a
          href="#features"
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            color: darkMode ? "#b0b0b0" : "#666",
            fontSize: "0.875rem",
            textDecoration: "none",
            animation: "bounce 2s infinite",
          }}
        >
          <span>Scroll Down</span>
          <ChevronDown size={20} />
        </a>
      </section>

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-10px) translateX(-50%);
          }
          60% {
            transform: translateY(-5px) translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

