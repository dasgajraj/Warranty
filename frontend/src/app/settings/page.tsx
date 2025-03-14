"use client"

import { useEffect, useState } from "react"
import { Bell, Shield, Wallet, Users, Mail, Cloud, Globe, Moon, Sun, Save, User, LogOut } from "lucide-react"
import styles from "./settings.module.css"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { toggleTheme } from "../store/theme-slice"
import Link from "next/link"
import { signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "../firebase-config"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const theme = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    setIsSigningOut(true)
    try {
      await firebaseSignOut(auth)
      showNotificationMessage("Signed out successfully")
      setTimeout(() => (window.location.href = "/"), 2000)
    } catch (error) {
      showNotificationMessage("Failed to sign out")
      console.error("Sign out error:", error)
      setIsSigningOut(false) // Reset the signing out state on error
    }
  }

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: Wallet },
    { id: "team", label: "Team Members", icon: Users },
    { id: "integrations", label: "Integrations", icon: Mail },
    { id: "backup", label: "Backup & Sync", icon: Cloud },
  ]

  return (
    <div className={`${styles.container} ${theme === "dark" ? styles.darkContainer : ""}`}>
      {showNotification && (
        <div className={`${styles.notification} ${theme === "dark" ? styles.darkNotification : ""}`}>
          {notificationMessage}
        </div>
      )}
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <Link
          href="/dashboard"
          className={styles.saveButton}
          onClick={() => showNotificationMessage("Settings saved successfully")}
        >
          <Save className={styles.saveIcon} />
          Save Changes
        </Link>
      </div>

      <div className={styles.content}>
        <nav className={styles.sidebar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className={styles.tabIcon} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.mainContent}>
          {activeTab === "account" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Account Settings</h2>

              <div className={styles.card}>
                {isLoading ? (
                  <div className={styles.loadingProfile}>Loading profile information...</div>
                ) : user ? (
                  <div className={styles.profileSection}>
                    <div className={styles.profileHeader}>
                      <div className={styles.profileImage}>
                        {user.photoURL ? (
                          <img src={user.photoURL || "/placeholder.svg"} alt="Profile" className={styles.userPhoto} />
                        ) : (
                          <div className={styles.userPhotoPlaceholder}>
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <div className={styles.profileInfo}>
                        <h3 className={styles.profileName}>{user.displayName || "User"}</h3>
                        <p className={styles.profileEmail}>{user.email || "No email available"}</p>
                      </div>
                    </div>

                    <div className={styles.accountActions}>
                      <button className={styles.signOutButton} onClick={signOut} disabled={isSigningOut}>
                        <LogOut className={styles.signOutIcon} />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.notSignedIn}>
                    <p>You are not signed in.</p>
                    <Link href="/login" className={styles.signInLink}>
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Profile Visibility</h3>
                    <p className={styles.settingDescription}>Control who can see your profile information</p>
                  </div>
                  <select className={styles.select}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="team">Team Only</option>
                  </select>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Account Type</h3>
                    <p className={styles.settingDescription}>Your current account type</p>
                  </div>
                  <div className={styles.accountType}>
                    <span className={styles.accountBadge}>Personal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>General Settings</h2>

              <div className={styles.card}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Theme Preference</h3>
                    <p className={styles.settingDescription}>Choose between light and dark mode</p>
                  </div>
                  <button
                    className={`${styles.themeToggle} ${theme === "dark" ? styles.darkMode : ""}`}
                    onClick={() => dispatch(toggleTheme())}
                  >
                    {theme === "dark" ? <Moon className={styles.themeIcon} /> : <Sun className={styles.themeIcon} />}
                  </button>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Document Storage Location</h3>
                    <p className={styles.settingDescription}>Choose where to store your warranty documents</p>
                  </div>
                  <select className={styles.select}>
                    <option value="cloud">Cloud Storage</option>
                    <option value="local">Local Storage</option>
                    <option value="hybrid">Hybrid Storage</option>
                  </select>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Default Document View</h3>
                    <p className={styles.settingDescription}>Choose how documents are displayed by default</p>
                  </div>
                  <select className={styles.select}>
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                    <option value="compact">Compact View</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Notification Preferences</h2>

              <div className={styles.card}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Push Notifications</h3>
                    <p className={styles.settingDescription}>Receive notifications for warranty expiration</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Email Notifications</h3>
                    <p className={styles.settingDescription}>Get email updates for important documents</p>
                  </div>
                  <select className={styles.select}>
                    <option value="all">All Updates</option>
                    <option value="important">Important Only</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Notification Schedule</h3>
                    <p className={styles.settingDescription}>When to receive notifications</p>
                  </div>
                  <select className={styles.select}>
                    <option value="instant">Instant</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Security Settings</h2>

              <div className={styles.card}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Two-Factor Authentication</h3>
                    <p className={styles.settingDescription}>Add an extra layer of security</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Document Access Control</h3>
                    <p className={styles.settingDescription}>Manage who can access your documents</p>
                  </div>
                  <select className={styles.select}>
                    <option value="private">Private</option>
                    <option value="team">Team Only</option>
                    <option value="custom">Custom Access</option>
                  </select>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Auto Backup</h3>
                    <p className={styles.settingDescription}>Automatically backup your documents</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={autoBackup} onChange={() => setAutoBackup(!autoBackup)} />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Backup & Sync Settings</h2>

              <div className={styles.card}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Auto-Sync</h3>
                    <p className={styles.settingDescription}>Keep your documents synced across devices</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={autoBackup} onChange={() => setAutoBackup(!autoBackup)} />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingTitle}>Backup Schedule</h3>
                    <p className={styles.settingDescription}>How often to backup your documents</p>
                  </div>
                  <select className={styles.select}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className={styles.backupStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Last Backup</span>
                    <span className={styles.statValue}>2 hours ago</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Storage Used</span>
                    <span className={styles.statValue}>2.4 GB</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Documents Backed Up</span>
                    <span className={styles.statValue}>143</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

