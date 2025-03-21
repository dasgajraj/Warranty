"use client"

import { useState, useEffect, useRef } from "react"
import { BarChart3, Calendar, CheckCircle2, ChevronRight, CircleEllipsis, ExternalLink, FileText, Home, LineChart, MoreHorizontal, MoreVertical, PieChart, Plus, Search, Settings, Share2, Target, User, Users, ChevronLeft, X } from 'lucide-react'
import styles from "./dashboard.module.css"
import sidebarStyles from "../sidebar.module.css"
import calendarStyles from "../calendar/Calendar.module.css"
import { useAppSelector } from "../store/hooks"
import AnimatedThemeToggle from "../components/animated-theme-toggle"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase-config"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("work")
  const [progress, setProgress] = useState(30)
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false)
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        console.log("No user is signed in")
      }
    })

    return () => unsubscribe()
  }, [])

  // Add a simple animation effect for the progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 30) return 30
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calendar navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek = firstDay.getDay()
    // Adjust for Monday as first day of week
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

    const totalDays = lastDay.getDate()
    const totalCells = Math.ceil((totalDays + adjustedStartDay) / 7) * 7

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push({ day: null, date: null })
    }

    // Add cells for each day of the month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i)

      // Sample events data - in a real app, this would come from your database
      const events = []
      if (i === 10 || i === 20) {
        events.push({ type: "purchase", title: "New Purchase" })
      }
      if (i === 15 || i === 25) {
        events.push({ type: "warranty_expiry", title: "Warranty Expiry" })
      }

      days.push({
        day: i,
        date: date,
        events: events,
      })
    }

    // Add empty cells for days after the last day of the month
    const remainingCells = totalCells - days.length
    for (let i = 0; i < remainingCells; i++) {
      days.push({ day: null, date: null })
    }

    return days
  }

  const days = generateCalendarDays()

  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const theme = useAppSelector((state) => state.theme.mode)

  return (
    <div className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}>
      {/* Left Sidebar */}
      <div className={sidebarStyles.sidebar}>
        <div className={sidebarStyles.logo}>
          <div className={sidebarStyles.logoIcon}>
            <Target className={sidebarStyles.logoSvg} />
          </div>
          <h1 className={sidebarStyles.logoText}>RASEED</h1>
        </div>

        <nav className={sidebarStyles.nav}>
          <button className={`${sidebarStyles.navButton} ${sidebarStyles.active}`}>
            <Home className={sidebarStyles.navIcon} />
            Dashboard
          </button>
          <button className={sidebarStyles.navButton} onClick={toggleCalendar}>
            <Calendar className={sidebarStyles.navIcon} />
            Calendar
          </button>
          <button className={sidebarStyles.navButton}>
            <CheckCircle2 className={sidebarStyles.navIcon} />
            My Documents
          </button>
          <button className={sidebarStyles.navButton}>
            <BarChart3 className={sidebarStyles.navIcon} />
            Statistics
          </button>
          <Link href="/warranties" className={sidebarStyles.navButton}>
            <FileText className={sidebarStyles.navIcon} />
            Warranties
          </Link>
        </nav>

        <div className={sidebarStyles.section}>
          <h3 className={sidebarStyles.sectionTitle}>TEAMS</h3>
          <nav className={sidebarStyles.nav}>
            <button className={sidebarStyles.navButton}>
              <Search className={sidebarStyles.navIcon} />
              Search
            </button>
            <button className={sidebarStyles.navButton}>
              <LineChart className={sidebarStyles.navIcon} />
              Insights
            </button>
          </nav>
        </div>

        <div className={sidebarStyles.footer}>
          <Link href="/settings" className={sidebarStyles.navButton}>
            <Settings className={sidebarStyles.navIcon} />
            Setting
          </Link>
        </div>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className={calendarStyles.calendarOverlay}>
          <div className={calendarStyles.calendarPopup} ref={calendarRef}>
            <div className={calendarStyles.calendarHeader}>
              <button className={calendarStyles.calendarNavButton} onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={20} />
              </button>
              <h2 className={calendarStyles.calendarTitle}>{formatMonth(currentDate)}</h2>
              <button className={calendarStyles.calendarNavButton} onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={20} />
              </button>
              <button
                className={calendarStyles.closeButton}
                onClick={() => setShowCalendar(false)}
                aria-label="Close calendar"
              >
                <X size={20} />
              </button>
            </div>

            <div className={calendarStyles.calendarGrid}>
              <div className={calendarStyles.weekdays}>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              <div className={calendarStyles.days}>
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      ${calendarStyles.day} 
                      ${!day.day ? calendarStyles.emptyDay : ""} 
                      ${day.date && isToday(day.date) ? calendarStyles.today : ""}
                      ${
                        day.date && selectedDate && day.date.toDateString() === selectedDate.toDateString()
                          ? calendarStyles.selected
                          : ""
                      }
                    `}
                    onClick={() => day.date && setSelectedDate(day.date)}
                  >
                    {day.day && (
                      <>
                        <span className={calendarStyles.dayNumber}>{day.day}</span>
                        {day.events && day.events.length > 0 && (
                          <div className={calendarStyles.eventDots}>
                            {day.events.map((event, i) => (
                              <span
                                key={i}
                                className={`
                                  ${calendarStyles.eventDot} 
                                  ${event.type === "purchase" ? calendarStyles.purchaseDot : calendarStyles.warrantyDot}
                                `}
                                title={event.title}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className={calendarStyles.eventsList}>
                <h3 className={calendarStyles.eventsTitle}>Events for {selectedDate.toLocaleDateString()}</h3>
                {days.find((d) => d.date && d.date.toDateString() === selectedDate.toDateString())?.events?.length ? (
                  <ul className={calendarStyles.events}>
                    {days
                      .find((d) => d.date && d.date.toDateString() === selectedDate.toDateString())
                      ?.events.map((event, index) => (
                        <li key={index} className={calendarStyles.eventItem}>
                          <span
                            className={`
                            ${calendarStyles.eventType} 
                            ${event.type === "purchase" ? calendarStyles.purchaseType : calendarStyles.warrantyType}
                          `}
                          >
                            {event.type === "purchase" ? "Purchase" : "Warranty Expiry"}
                          </span>
                          <span className={calendarStyles.eventTitle}>{event.title}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className={calendarStyles.noEvents}>No events for this date</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.greeting}>Hi, {user ? user.displayName || "User" : "User"}!</h1>
          <div className={styles.headerActions}>
            <button className={styles.createButton}>
              <Plus className={styles.buttonIcon} />
              Create
            </button>
            <AnimatedThemeToggle />
            <button className={styles.iconButton}>
              <Search className={styles.iconButtonSvg} />
            </button>
            <button className={styles.iconButton}>
              <Bell className={styles.iconButtonSvg} />
              <span className={styles.notificationDot}></span>
            </button>
            <div className={styles.avatar}>
              {user ? (
                user.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt="User Photo"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <User className={styles.iconButtonSvg} />
                )
              ) : (
                <User className={styles.iconButtonSvg} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Task Overview Card */}
          <div className={`${styles.card} ${styles.darkCard}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Document Overview</h3>
              <div className={styles.cardActions}>
                <button className={styles.cardIconButton}>
                  <Share2 className={styles.cardActionIcon} />
                </button>
                <button className={styles.cardIconButton}>
                  <MoreVertical className={styles.cardActionIcon} />
                </button>
              </div>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <h2 className={styles.statValue}>43</h2>
                <p className={styles.statLabel}>
                  Documents
                  <br />
                  saved
                </p>
              </div>
              <div className={styles.stat}>
                <h2 className={styles.statValue}>2</h2>
                <p className={styles.statLabel}>
                  Warranties
                  <br />
                  expiring soon
                </p>
              </div>
            </div>

            <div className={styles.progressBars}>
              <div className={styles.progressBar}>
                <div className={styles.progressBarFill} style={{ width: "80%" }}></div>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressBarFill} style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <Target className={styles.statBoxIcon} />
                <p className={styles.statBoxLabel}>Categories</p>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxValue}>2</div>
                <p className={styles.statBoxLabel}>Pending</p>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxValue}>25</div>
                <p className={styles.statBoxLabel}>Archived</p>
              </div>
            </div>
          </div>

          {/* Weekly Process Card */}
          <div className={`${styles.card} ${styles.lightCard}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Weekly uploads</h3>
              <button className={styles.cardIconButton}>
                <PieChart className={styles.cardActionIcon} />
              </button>
            </div>

            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.blackDot}`}></div>
                <span className={styles.legendLabel}>Receipts</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.grayDot}`}></div>
                <span className={styles.legendLabel}>Warranties</span>
              </div>
            </div>

            <div className={styles.chart}>
              {/* Chart placeholder - in a real app, use a chart library */}
              <svg className={styles.chartSvg} viewBox="0 0 300 120">
                <path
                  d="M0,100 L30,80 L60,90 L90,40 L120,60 L150,30 L180,70 L210,50 L240,60 L270,40 L300,60"
                  className={styles.chartLine}
                />
                <circle cx="150" cy="30" r="4" className={styles.chartPoint} />
                <line x1="150" y1="0" x2="150" y2="30" className={styles.chartDashedLine} />
                <text x="150" y="15" className={styles.chartText}>
                  7
                </text>
              </svg>
            </div>

            <div className={styles.chartDays}>
              <div className={styles.day}>M</div>
              <div className={styles.day}>T</div>
              <div className={styles.day}>W</div>
              <div className={styles.day}>T</div>
              <div className={styles.day}>F</div>
              <div className={styles.day}>S</div>
              <div className={`${styles.day} ${styles.activeDay}`}>S</div>
            </div>
          </div>

          {/* Month Progress Card */}
          <div className={`${styles.card} ${styles.whiteCard}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Month Progress</h3>
              <button className={styles.cardIconButton}>
                <ExternalLink className={styles.cardActionIcon} />
              </button>
            </div>

            <div className={styles.progressInfo}>
              <div className={styles.progressText}>
                <span className={styles.progressPercent}>{progress}%</span>
                <span className={styles.progressLabel}>completed to last month*</span>
              </div>
            </div>

            <h4 className={styles.sectionTitle}>OVERVIEW</h4>

            <div className={styles.overviewRow}>
              <div className={styles.legendColumn}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.blackDot}`}></div>
                  <span className={styles.legendLabel}>Receipts</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.grayDot}`}></div>
                  <span className={styles.legendLabel}>Warranties</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.lightGrayDot}`}></div>
                  <span className={styles.legendLabel}>Manuals</span>
                </div>
              </div>
              <div className={styles.circleProgressContainer}>
                <div className={styles.circleProgress}>
                  <svg className={styles.circleProgressSvg} viewBox="0 0 36 36">
                    <path
                      className={styles.circleProgressBg}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={styles.circleProgressFill}
                      strokeDasharray={`${progress}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className={styles.circleProgressText}>
                      {progress}%
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button className={styles.shareButton}>
                <Share2 className={styles.shareIcon} />
              </button>
              <button className={styles.downloadButton}>Download Report</button>
            </div>
          </div>

          {/* Month Goals Card */}
          <div className={`${styles.card} ${styles.whiteCard}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Monthly Purchased</h3>
              <div className={styles.badgeContainer}>
                <span className={styles.badge}>1/4</span>
                <button className={styles.editButton}>
                  <PencilIcon className={styles.editIcon} />
                </button>
              </div>
            </div>

            <ul className={styles.goalsList}>
              <li className={styles.goalItem}>
                <div className={`${styles.goalCheck} ${styles.goalChecked}`}>
                  <CheckIcon className={styles.checkIcon} />
                </div>
                <span className={styles.goalText}>Iphone 16 Pro Max</span>
              </li>
              <li className={styles.goalItem}>
                <div className={styles.goalCheck}></div>
                <span className={styles.goalText}>Washing Machine</span>
              </li>
              <li className={styles.goalItem}>
                <div className={styles.goalCheck}></div>
                <span className={styles.goalText}>Asus Rog 16x</span>
              </li>
              <li className={styles.goalItem}>
                <div className={styles.goalCheck}></div>
                <span className={styles.goalText}>Ipad Pro </span>
              </li>
            </ul>
          </div>

          {/* Meeting Cards */}
          <div className={styles.meetingsColumn}>
            <div className={`${styles.card} ${styles.whiteCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.meetingInfo}>
                  <div className={styles.meetingIcon}>
                    <Users className={styles.meetingIconSvg} />
                  </div>
                  <div>
                    <h3 className={styles.meetingTitle}>Warranty Renewal</h3>
                  </div>
                </div>
                <button className={styles.cardIconButton}>
                  <MoreHorizontal className={styles.cardActionIcon} />
                </button>
              </div>

              <div className={styles.meetingFooter}>
                <span className={styles.meetingTime}>Tonight</span>
                <button className={styles.chatButton}>
                  <MessageSquare className={styles.chatIcon} />
                </button>
              </div>
            </div>

            <div className={`${styles.card} ${styles.whiteCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.meetingInfo}>
                  <div className={styles.meetingIcon}>
                    <User className={styles.meetingIconSvg} />
                  </div>
                  <div>
                    <h3 className={styles.meetingTitle}>Insurance Review</h3>
                  </div>
                </div>
                <button className={styles.cardIconButton}>
                  <MoreHorizontal className={styles.cardActionIcon} />
                </button>
              </div>

              <div className={styles.meetingFooter}>
                <span className={styles.meetingTime}>Next Morning</span>
                <button className={styles.chatButton}>
                  <MessageSquare className={styles.chatIcon} />
                </button>
              </div>
            </div>

            <div className={styles.addTaskCard}>
              <span className={styles.addTaskText}>+ Add a task</span>
            </div>
          </div>

          {/* Last Projects Section */}
          <div className={styles.projectsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Recent Documents</h3>
              <button className={styles.archiveButton}>
                Open archive
                <ChevronRight className={styles.archiveIcon} />
              </button>
            </div>

            <div className={styles.projectsGrid}>
              <div className={`${styles.card} ${styles.darkCard}`}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>New TV Warranty</h3>
                  <button className={styles.projectActionButton}>
                    <CircleEllipsis className={styles.projectActionIcon} />
                  </button>
                </div>
                <div className={styles.projectStatus}>
                  <div className={styles.statusDot}></div>
                  <span className={styles.statusText}>In progress</span>
                </div>
                <p className={styles.projectDescription}>
                  <span className={styles.projectLabel}>Done:</span> Scanned warranty card and uploaded receipt for the
                  new Samsung TV
                </p>
              </div>

              <div className={`${styles.card} ${styles.darkCard}`}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Phone Insurance</h3>
                  <button className={styles.projectActionButton}>
                    <CircleEllipsis className={styles.projectActionIcon} />
                  </button>
                </div>
                <div className={styles.projectStatus}>
                  <div className={styles.statusDot}></div>
                  <span className={styles.statusText}>Completed</span>
                </div>
              </div>

              <div className={`${styles.card} ${styles.darkCard}`}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Laptop Receipts</h3>
                  <button className={styles.projectActionButton}>
                    <CircleEllipsis className={styles.projectActionIcon} />
                  </button>
                </div>
                <div className={styles.projectStatus}>
                  <div className={styles.statusDot}></div>
                  <span className={styles.statusText}>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Additional icons needed
function MessageSquare(props) {
  return (
    <svg
      {...props}
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Bell(props) {
  return (
    <svg
      {...props}
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function PencilIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
