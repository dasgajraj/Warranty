"use client"

import { useEffect, useState } from "react"
import { Bell, Shield, Wallet, Users, Mail, Cloud, Globe, Moon, Sun, Save } from "lucide-react"
import styles from "./settings.module.css"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { toggleTheme } from "../store/theme-slice"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const theme = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const tabs = [
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
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <button className={styles.saveButton}>
          <Save className={styles.saveIcon} />
          Save Changes
        </button>
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

              <div className={styles.card}>
                <div className={styles.dangerZone}>
                  <h3 className={styles.dangerTitle}>Danger Zone</h3>
                  <button className={styles.dangerButton}>Delete Account</button>
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

