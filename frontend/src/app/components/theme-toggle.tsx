"use client"

import { useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { toggleTheme } from "../store/theme-slice"
import styles from "./theme-toggle.module.css"

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon className={styles.themeIcon} /> : <Sun className={styles.themeIcon} />}
    </button>
  )
}

