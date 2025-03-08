"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from 'lucide-react'
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { toggleTheme } from "../store/theme-slice"
import styles from "./animated-theme-toggle.module.css"

export default function AnimatedThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)
  const [isAnimating, setIsAnimating] = useState(false)

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const handleToggle = () => {
    setIsAnimating(true)
    dispatch(toggleTheme())
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 700) // Match this with the CSS animation duration
  }

  return (
    <button
      onClick={handleToggle}
      className={`${styles.themeToggle} ${isAnimating ? styles.animating : ""}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className={styles.iconContainer}>
        <Sun className={`${styles.sunIcon} ${theme === "dark" ? styles.visible : styles.hidden}`} />
        <Moon className={`${styles.moonIcon} ${theme === "light" ? styles.visible : styles.hidden}`} />
      </div>
    </button>
  )
}
