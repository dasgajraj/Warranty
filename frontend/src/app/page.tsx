"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleEllipsis,
  ExternalLink,
  FileText,
  Home,
  LineChart,
  MoreHorizontal,
  MoreVertical,
  PieChart,
  Plus,
  Search,
  Settings,
  Share2,
  Slack,
  Target,
  User,
  Users,
} from "lucide-react"
import styles from "./Dashboard.module.css"
import sidebarStyles from "./sidebar.module.css"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("work")
  const [progress, setProgress] = useState(30)

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

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <div className={sidebarStyles.sidebar}>
        <div className={sidebarStyles.logo}>
          <div className={sidebarStyles.logoIcon}>
            <Target className={sidebarStyles.logoSvg} />
          </div>
          <h1 className={sidebarStyles.logoText}>WarrantyVault</h1>
        </div>

        <nav className={sidebarStyles.nav}>
          <button className={`${sidebarStyles.navButton} ${sidebarStyles.active}`}>
            <Home className={sidebarStyles.navIcon} />
            Dashboard
          </button>
          <button className={sidebarStyles.navButton}>
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
          <button className={sidebarStyles.navButton}>
            <FileText className={sidebarStyles.navIcon} />
            Warranties
          </button>
        </nav>

        <div className={sidebarStyles.section}>
          <h3 className={sidebarStyles.sectionTitle}>INTEGRATION</h3>
          <nav className={sidebarStyles.nav}>
            <button className={sidebarStyles.navButton}>
              <Slack className={sidebarStyles.navIcon} />
              Slack
            </button>
            <button className={sidebarStyles.navButton}>
              <MessageSquare className={sidebarStyles.navIcon} />
              Discord
            </button>
            <button className={sidebarStyles.navButton}>
              <Plus className={sidebarStyles.navIcon} />
              Add new plugin
            </button>
          </nav>
        </div>

        <div className={sidebarStyles.section}>
          <h3 className={sidebarStyles.sectionTitle}>TEAMS</h3>
          <nav className={sidebarStyles.nav}>
            <button className={sidebarStyles.navButton}>
              <Search className={sidebarStyles.navIcon} />
              Seo
            </button>
            <button className={sidebarStyles.navButton}>
              <LineChart className={sidebarStyles.navIcon} />
              Marketing
            </button>
          </nav>
        </div>

        <div className={sidebarStyles.footer}>
          <button className={sidebarStyles.navButton}>
            <Settings className={sidebarStyles.navIcon} />
            Setting
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.greeting}>Hi, User!</h1>
          <div className={styles.headerActions}>
            <button className={styles.createButton}>
              <Plus className={styles.buttonIcon} />
              Create
            </button>
            <button className={styles.iconButton}>
              <Search className={styles.iconButtonSvg} />
            </button>
            <button className={styles.iconButton}>
              <Bell className={styles.iconButtonSvg} />
              <span className={styles.notificationDot}></span>
            </button>
            <div className={styles.avatar}>
              <img src="/placeholder.svg?height=40&width=40" alt="User" />
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
              <h3 className={styles.cardTitle}>Monthly Goals</h3>
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
                <span className={styles.goalText}>Scan 10 receipts</span>
              </li>
              <li className={styles.goalItem}>
                <div className={styles.goalCheck}></div>
                <span className={styles.goalText}>Organize electronics warranties</span>
              </li>
              <li className={styles.goalItem}>
                <div className={styles.goalCheck}></div>
                <span className={styles.goalText}>Update appliance documents</span>
              </li>
              <li className={styles.goalItem}>
                <div className={styles.goalCheck}></div>
                <span className={styles.goalText}>Backup all documents to cloud</span>
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

