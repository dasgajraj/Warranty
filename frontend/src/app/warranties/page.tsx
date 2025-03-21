"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  ChevronLeft,
  X,
  Bell,
  SortAsc,
  SortDesc,
  Trash2,
  Edit,
  Save,
  Camera,
} from "lucide-react"
import AnimatedThemeToggle from "../components/animated-theme-toggle"
import { useAppSelector } from "../store/hooks"
import styles from "./warranties.module.css"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase-config"

// Updated Warranty interface to match API structure
interface Warranty {
  id?: number
  product_name: string
  user_uid: string
  ipfs_hash: string
  uploaded_at: string
  warranty_start_date: string
  warranty_end_date: string
  brand?: string
  model?: string
  serialNumber?: string
  status?: string
  image?: string
  notes?: string
  reminderSet?: boolean
}

export default function WarrantiesPage() {
  // Redux state
  const theme = useAppSelector((state) => state.theme.mode)

  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const [currentWarranty, setCurrentWarranty] = useState<Warranty | null>(null)
  const [sortBy, setSortBy] = useState<string>("warranty_end_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [user, setUser] = useState<any>(null)

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        console.log("No user is signed in")
      }
    })

    return () => unsubscribe()
  }, [])

  // Fetch warranties from API when user is authenticated
  useEffect(() => {
    const fetchWarranties = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`http://127.0.0.1:5000/api/slip/?user_uid=${user.uid}`)
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        
        const data = await response.json()
        
        // Process the API data to fit our component needs
        const processedData = data.map((item: Warranty, index: number) => ({
          id: index + 1,
          product_name: item.product_name,
          user_uid: item.user_uid,
          ipfs_hash: item.ipfs_hash,
          uploaded_at: item.uploaded_at,
          warranty_start_date: item.warranty_start_date,
          warranty_end_date: item.warranty_end_date,
          // Add default values for UI elements not in the API
          brand: "Not specified",
          model: "Not specified",
          serialNumber: "Not specified",
          status: determineWarrantyStatus(item.warranty_end_date),
          image: "/placeholder.svg?height=200&width=300",
          reminderSet: false
        }))
        
        setWarranties(processedData)
      } catch (err) {
        console.error("Error fetching warranty data:", err)
        showNotificationMessage("Failed to load warranty data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchWarranties()
    }
  }, [user])

  // Determine warranty status based on end date
  const determineWarrantyStatus = (endDate: string) => {
    const today = new Date()
    const expiryDate = new Date(endDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)
    
    if (expiryDate < today) {
      return "expired"
    } else if (expiryDate <= thirtyDaysFromNow) {
      return "expiring-soon"
    } else {
      return "active"
    }
  }

  // Check for expiring warranties
  useEffect(() => {
    if (!isLoading && warranties.length > 0) {
      const expiringWarranties = warranties.filter(warranty => warranty.status === "expiring-soon")
      
      if (expiringWarranties.length > 0) {
        setNotificationMessage(`You have ${expiringWarranties.length} warranties expiring soon!`)
        setShowNotification(true)

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false)
        }, 5000)
      }
    }
  }, [isLoading, warranties])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter and sort warranties
  const processedWarranties = warranties
    .filter(
      (warranty) =>
        warranty.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (warranty.brand && warranty.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (warranty.model && warranty.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (warranty.serialNumber && warranty.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .filter((warranty) => filter === "all" || warranty.status === filter)
    .sort((a, b) => {
      // Handle different sort fields
      if (sortBy === "warranty_end_date") {
        const dateA = new Date(a.warranty_end_date).getTime()
        const dateB = new Date(b.warranty_end_date).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else if (sortBy === "warranty_start_date") {
        const dateA = new Date(a.warranty_start_date).getTime()
        const dateB = new Date(b.warranty_start_date).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else {
        // Sort by product name
        const nameA = a.product_name.toLowerCase()
        const nameB = b.product_name.toLowerCase()
        return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      }
    })

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilter = (status: string) => {
    setFilter(status)
  }

  const handleCardFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id)
  }

  const handleDownload = (warranty: Warranty) => {
    // In a real application, this would generate and download a PDF
    console.log(`Downloading warranty for ${warranty.product_name}`)
    showNotificationMessage(`Warranty details for ${warranty.product_name} downloaded`)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // New field, default to ascending
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const handleDropdownToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(showDropdown === id ? null : id)
  }
  
  const toggleReminder = (warranty: Warranty, e: React.MouseEvent) => {
    e.stopPropagation()
    setWarranties(warranties.map((w) => (w.id === warranty.id ? { ...w, reminderSet: !w.reminderSet } : w)))

    showNotificationMessage(
      warranty.reminderSet
        ? `Reminder for ${warranty.product_name} turned off`
        : `Reminder for ${warranty.product_name} set`,
    )
    setShowDropdown(null)
  }

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  return (
    <div className={styles.container}>
      {/* Header with theme toggle */}
      <header className={styles.header}>
        <h1 className={styles.title}>Your Warranties</h1>
        <AnimatedThemeToggle/>
      </header>

      {!user && (
        <div className={styles.noResults}>
          <AlertCircle className={styles.noResultsIcon} />
          <p>Please sign in to view your warranties.</p>
        </div>
      )}

      {user && (
        <>
          {/* Controls section */}
          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search warranties..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search warranties"
              />
              {searchTerm && (
                <button className={styles.clearSearch} onClick={() => setSearchTerm("")} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className={styles.filterControls}>
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`}
                  onClick={() => handleFilter("all")}
                >
                  All
                </button>
                <button
                  className={`${styles.filterButton} ${filter === "active" ? styles.active : ""}`}
                  onClick={() => handleFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`${styles.filterButton} ${filter === "expiring-soon" ? styles.active : ""}`}
                  onClick={() => handleFilter("expiring-soon")}
                >
                  Expiring Soon
                </button>
              </div>

              <div className={styles.sortControls}>
                <button className={styles.sortButton} onClick={() => handleSort("product_name")} aria-label="Sort by name">
                  <span>Name</span>
                  {sortBy === "product_name" && (sortDirection === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                </button>
                <button
                  className={styles.sortButton}
                  onClick={() => handleSort("warranty_end_date")}
                  aria-label="Sort by expiry date"
                >
                  <span>Expiry</span>
                  {sortBy === "warranty_end_date" && (sortDirection === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                </button>
              </div>
            </div>
          </div>

          {/* Warranty cards grid */}
          <div className={styles.warrantyGrid}>
            {isLoading ? (
              // Show skeleton loader while loading
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={`${styles.warrantyCard} ${styles.skeleton}`}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonText}></div>
                  </div>
                </div>
              ))
            ) : processedWarranties.length > 0 ? (
              processedWarranties.map((warranty) => (
                <div
                  key={warranty.id}
                  className={`${styles.warrantyCard} ${flippedCard === warranty.id ? styles.flipped : ""}`}
                  onClick={() => handleCardFlip(warranty.id!)}
                >
                  <div className={styles.cardInner}>
                    {/* Front of card */}
                    <div className={styles.cardFront}>
                      <div className={styles.cardHeader}>
                        <img
                          src={warranty.image || "/placeholder.svg?height=200&width=300"}
                          alt={warranty.product_name}
                          className={styles.productImage}
                        />

                        {/* Reminder indicator */}
                        {warranty.reminderSet && (
                          <div className={styles.reminderBadge} title="Reminder set">
                            <Bell size={14} />
                          </div>
                        )}
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.productName}>{warranty.product_name}</h3>
                        {warranty.brand && warranty.model && (
                          <p className={styles.brand}>
                            {warranty.brand} {warranty.model}
                          </p>
                        )}
                        <div className={styles.dateInfo}>
                          <div className={styles.date}>
                            <Calendar className={styles.dateIcon} />
                            <span>Expires: {new Date(warranty.warranty_end_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`${styles.status} ${styles[warranty.status || "active"]}`}>
                          {warranty.status === "active" && <CheckCircle className={styles.statusIcon} />}
                          {warranty.status === "expiring-soon" && <Clock className={styles.statusIcon} />}
                          <span>
                            {warranty.status === "active"
                              ? "Active"
                              : warranty.status === "expiring-soon"
                                ? "Expiring Soon"
                                : "Expired"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div className={styles.cardBack}>
                      <button className={styles.backButton} onClick={() => handleCardFlip(warranty.id!)}>
                        <ChevronLeft className={styles.backIcon} />
                        Back
                      </button>
                      <h3 className={styles.backTitle}>{warranty.product_name}</h3>
                      <div className={styles.backContent}>
                        {warranty.brand && (
                          <p>
                            <strong>Brand:</strong> {warranty.brand}
                          </p>
                        )}
                        {warranty.model && (
                          <p>
                            <strong>Model:</strong> {warranty.model}
                          </p>
                        )}
                        {warranty.serialNumber && (
                          <p>
                            <strong>Serial Number:</strong> {warranty.serialNumber}
                          </p>
                        )}
                        <p>
                          <strong>Purchase Date:</strong> {new Date(warranty.warranty_start_date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Expiry Date:</strong> {new Date(warranty.warranty_end_date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>IPFS Hash:</strong> <span className={styles.hash}>{warranty.ipfs_hash}</span>
                        </p>
                        <p>
                          <strong>Uploaded:</strong> {new Date(warranty.uploaded_at).toLocaleDateString()}
                        </p>
                        {warranty.notes && (
                          <p>
                            <strong>Notes:</strong> {warranty.notes}
                          </p>
                        )}
                      </div>
                      <div className={styles.backActions}>
                        <button
                          className={styles.reminderButton}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleReminder(warranty, e)
                          }}
                        >
                          <Bell className={styles.reminderIcon} />
                          {warranty.reminderSet ? "Remove Reminder" : "Set Reminder"}
                        </button>
                        <button
                          className={styles.downloadButton}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(warranty)
                          }}
                        >
                          <Download className={styles.downloadIcon} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <AlertCircle className={styles.noResultsIcon} />
                <p>No warranties found. Try adjusting your search or filter.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Notification */}
      {showNotification && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            <AlertCircle size={20} />
            <p>{notificationMessage}</p>
          </div>
          <button className={styles.closeNotification} onClick={() => setShowNotification(false)}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}