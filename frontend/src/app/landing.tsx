"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Shield,
  Lock,
  Database,
  FileText,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Check,
  ArrowRight,
  Target,
} from "lucide-react"
import styles from "./landing.module.css"
import AuthModal from "./auth-modal"
import ReceiptToBlockchainAnimation from './receipt/page'

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const containerRef = useRef(null)
  const receiptRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const receiptY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const receiptRotate = useTransform(scrollYProgress, [0, 0.3], [0, 15])
  const receiptScale = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1.1, 1])
  const receiptOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  useEffect(() => {
    // Initialize theme based on user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)
    if (prefersDark) document.documentElement.classList.add("dark")

    // Smooth scroll initialization
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })

    // Simulate tearing attempt animation
    const interval = setInterval(() => {
      if (receiptRef.current) {
        receiptRef.current.classList.add(styles.receiptTearAttempt)
        setTimeout(() => {
          if (receiptRef.current) {
            receiptRef.current.classList.remove(styles.receiptTearAttempt)
          }
        }, 1000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`} ref={containerRef}>
      {/* Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Target className={styles.logoIcon} />
          <span className={styles.logoText}>W~Warranty</span>
        </div>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ""}`}>
          <a href="#features" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Features
          </a>
          <a href="#how-it-works" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </a>
          <a href="#benefits" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Benefits
          </a>
          <a href="#testimonials" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Testimonials
          </a>
        </div>

        <div className={styles.navRight}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {darkMode ? <Sun className={styles.themeIcon} /> : <Moon className={styles.themeIcon} />}
          </button>
          <div className={styles.authButtons}>
            <button className={styles.loginButton} onClick={() => openAuthModal("login")}>
              Login
            </button>
            <button className={styles.signupButton} onClick={() => openAuthModal("signup")}>
              Sign Up
            </button>
          </div>
          <button className={styles.menuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Blockchain-Powered
            <br />
            Warranty Management
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure, immutable, and decentralized warranty records
            <br />
            powered by Hyperledger Fabric and IPFS
          </motion.p>
          <motion.div
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className={styles.primaryButton} onClick={() => openAuthModal("signup")}>
              Get Started
            </button>
            <button className={styles.secondaryButton}>Learn More</button>
          </motion.div>
        </div>
       <ReceiptToBlockchainAnimation speed={1.5} /> {/* Higher number = faster animation */}
        <a href="#features" className={styles.scrollDown}>
          <span>Scroll Down</span>
          <ChevronDown className={styles.scrollIcon} />
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeaderTitle}>Key Features</h2>
          <p className={styles.sectionHeaderText}>
            Our blockchain-based warranty system offers unparalleled security and convenience
          </p>
        </div>

        <div className={styles.featureGrid}>
          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={styles.featureIcon}>
              <Lock />
            </div>
            <h3>Immutable Records</h3>
            <p>Warranty information cannot be altered or tampered with once recorded on the blockchain</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className={styles.featureIcon}>
              <Database />
            </div>
            <h3>Decentralized Storage</h3>
            <p>Warranty documents stored on IPFS for enhanced security and accessibility</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.featureIcon}>
              <FileText />
            </div>
            <h3>Smart Contracts</h3>
            <p>Automated warranty validation and claim processing through smart contracts</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className={styles.featureIcon}>
              <Shield />
            </div>
            <h3>Fraud Prevention</h3>
            <p>Eliminate warranty fraud with cryptographic proof of purchase and ownership</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeaderTitle}>How It Works</h2>
          <p className={styles.sectionHeaderText}>Simple, secure, and transparent warranty management</p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.stepsLine}></div>

          <motion.div
            className={styles.step}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepContentTitle}>Purchase Registration</h3>
              <p className={styles.stepContentText}>
                When you purchase a product, the warranty information is registered on the blockchain with a unique
                identifier
              </p>
            </div>
          </motion.div>

          <motion.div
            className={styles.step}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepContentTitle}>Document Storage</h3>
              <p className={styles.stepContentText}>
                Warranty documents and receipts are securely stored on IPFS with references recorded on the blockchain
              </p>
            </div>
          </motion.div>

          <motion.div
            className={styles.step}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepContentTitle}>Warranty Management</h3>
              <p className={styles.stepContentText}>
                Access and manage all your warranties through our intuitive dashboard
              </p>
            </div>
          </motion.div>

          <motion.div
            className={styles.step}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepContentTitle}>Claim Processing</h3>
              <p className={styles.stepContentText}>
                Submit and track warranty claims with transparent processing through smart contracts
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={styles.benefits}>
        <div className={styles.benefitsContent}>
          <motion.div
            className={styles.benefitsText}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.benefitsTextTitle}>Why Choose Blockchain for Warranties?</h2>
            <ul className={styles.benefitsList}>
              <li>
                <span className={styles.checkmark}>
                  <Check size={18} />
                </span>
                <span>Eliminate warranty fraud and disputes</span>
              </li>
              <li>
                <span className={styles.checkmark}>
                  <Check size={18} />
                </span>
                <span>Never lose a warranty document again</span>
              </li>
              <li>
                <span className={styles.checkmark}>
                  <Check size={18} />
                </span>
                <span>Streamlined claim process with faster resolution</span>
              </li>
              <li>
                <span className={styles.checkmark}>
                  <Check size={18} />
                </span>
                <span>Transparent history of ownership and service</span>
              </li>
              <li>
                <span className={styles.checkmark}>
                  <Check size={18} />
                </span>
                <span>Enhanced security through decentralization</span>
              </li>
            </ul>
            <button className={styles.primaryButton} onClick={() => openAuthModal("signup")}>
              Start Securing Your Warranties
              <ArrowRight size={16} className={styles.buttonIcon} />
            </button>
          </motion.div>

          <motion.div
            className={styles.benefitsImage}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={styles.blockchainVisual}>
              <div className={styles.blockchainBlocks}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.block}>
                    <div className={styles.blockHeader}>
                      <div className={styles.blockHash}>#F8D9A6</div>
                      <div className={styles.blockTime}>12:45:30</div>
                    </div>
                    <div className={styles.blockData}>
                      <div className={styles.dataLine}></div>
                      <div className={styles.dataLine}></div>
                      <div className={styles.dataLine}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.blockchainConnectors}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={styles.connector}></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeaderTitle}>What Our Users Say</h2>
          <p className={styles.sectionHeaderText}>
            Join thousands of satisfied customers who trust our blockchain warranty system
          </p>
        </div>

        <div className={styles.testimonialGrid}>
          <motion.div
            className={styles.testimonialCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "I used to lose my warranty papers all the time. Now everything is securely stored and accessible
                whenever I need it. The blockchain aspect gives me confidence that my records can't be tampered with."
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>
                <img src="/placeholder.svg?height=50&width=50" alt="User Avatar" />
              </div>
              <div className={styles.authorInfo}>
                <h4 className={styles.authorName}>Sarah Johnson</h4>
                <p className={styles.authorTitle}>Tech Enthusiast</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.testimonialCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "As a retailer, this system has streamlined our warranty process significantly. Customer disputes have
                decreased by 78% since we implemented this blockchain solution."
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>
                <img src="/placeholder.svg?height=50&width=50" alt="User Avatar" />
              </div>
              <div className={styles.authorInfo}>
                <h4 className={styles.authorName}>Michael Chen</h4>
                <p className={styles.authorTitle}>Retail Manager</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.testimonialCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "The smart contract functionality automatically notified me when my warranty was about to expire. I was
                able to get my laptop repaired just in time. Brilliant service!"
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>
                <img src="/placeholder.svg?height=50&width=50" alt="User Avatar" />
              </div>
              <div className={styles.authorInfo}>
                <h4 className={styles.authorName}>Alex Rodriguez</h4>
                <p className={styles.authorTitle}>Software Developer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>Ready to Secure Your Warranties?</h2>
          <p className={styles.ctaText}>
            Join thousands of users who trust our blockchain-based warranty management system
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton} onClick={() => openAuthModal("signup")}>
              Get Started Now
            </button>
            <button className={styles.outlineButton}>Schedule a Demo</button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Target className={styles.footerLogoIcon} />
            <span className={styles.footerLogoText}>WarrantyVault</span>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>Product</h3>
              <ul className={styles.footerColumnList}>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Features
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Pricing
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Case Studies
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>Company</h3>
              <ul className={styles.footerColumnList}>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    About Us
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Careers
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Blog
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerColumnTitle}>Resources</h3>
              <ul className={styles.footerColumnList}>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Support
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Contact
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Privacy Policy
                  </a>
                </li>
                <li className={styles.footerColumnListItem}>
                  <a href="#" className={styles.footerLink}>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} WarrantyVault. All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="GitHub">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

