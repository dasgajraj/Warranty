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

// Warranty type definition
interface Warranty {
  id: number
  productName: string
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  expiryDate: string
  status: string
  image: string
  notes?: string
  reminderSet?: boolean
}

// Mock data for warranties
const mockWarranties = [
  {
    id: 1,
    productName: "Samsung 4K QLED TV",
    brand: "Samsung",
    model: "QN90A",
    serialNumber: "SN1234567890",
    purchaseDate: "2023-01-15",
    expiryDate: "2026-01-15",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    notes: "Extended warranty purchased",
    reminderSet: true,
  },
  {
    id: 2,
    productName: 'MacBook Pro 16"',
    brand: "Apple",
    model: "MBP16-2021",
    serialNumber: "C02XL0THJGH7",
    purchaseDate: "2022-11-30",
    expiryDate: "2025-11-30",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
    notes: "AppleCare+ included",
    reminderSet: true,
  },
  {
    id: 3,
    productName: "Dyson V11 Vacuum",
    brand: "Dyson",
    model: "V11 Absolute",
    serialNumber: "DY1234567890",
    purchaseDate: "2022-08-01",
    expiryDate: "2024-08-01",
    status: "expiring-soon",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    reminderSet: false,
  },
  {
    id: 4,
    productName: "Sony WH-1000XM4 Headphones",
    brand: "Sony",
    model: "WH-1000XM4",
    serialNumber: "SN9876543210",
    purchaseDate: "2022-03-15",
    expiryDate: "2024-03-15",
    status: "expiring-soon",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80",
    reminderSet: true,
  },
  {
    id: 7,
    productName: "Canon EOS R5 Camera",
    brand: "Canon",
    model: "EOS R5",
    serialNumber: "CN1234567890",
    purchaseDate: "2023-03-15",
    expiryDate: "2025-03-15",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    notes: "Includes lens warranty",
    reminderSet: false,
  },
  {
    id: 6,
    productName: "Nikon Z6 II Camera",
    brand: "Nikon",
    model: "Z6 II",
    serialNumber: "NK9876543210",
    purchaseDate: "2022-06-20",
    expiryDate: "2024-06-20",
    status: "expiring-soon",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    reminderSet: true,
  },
]

export default function WarrantiesPage() {
  // Redux state
  const theme = useAppSelector((state) => state.theme.mode)

  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [warranties, setWarranties] = useState<Warranty[]>(mockWarranties)
  const [isLoading, setIsLoading] = useState(true)
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const [currentWarranty, setCurrentWarranty] = useState<Warranty | null>(null)
  const [sortBy, setSortBy] = useState<string>("expiryDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load data and check for expiring warranties
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false)

      // Check for warranties expiring in the next 30 days
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)

      const expiringWarranties = warranties.filter((warranty) => {
        const expiryDate = new Date(warranty.expiryDate)
        return expiryDate > today && expiryDate <= thirtyDaysFromNow && warranty.status === "expiring-soon"
      })

      if (expiringWarranties.length > 0) {
        setNotificationMessage(`You have ${expiringWarranties.length} warranties expiring soon!`)
        setShowNotification(true)

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false)
        }, 5000)
      }
    }, 1500)
  }, [])

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
        warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warranty.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warranty.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warranty.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((warranty) => filter === "all" || warranty.status === filter)
    .sort((a, b) => {
      // Handle different sort fields
      if (sortBy === "expiryDate") {
        const dateA = new Date(a.expiryDate).getTime()
        const dateB = new Date(b.expiryDate).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else if (sortBy === "purchaseDate") {
        const dateA = new Date(a.purchaseDate).getTime()
        const dateB = new Date(b.purchaseDate).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else {
        // Sort by product name
        const nameA = a.productName.toLowerCase()
        const nameB = b.productName.toLowerCase()
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
    console.log(`Downloading warranty for ${warranty.productName}`)
    showNotificationMessage(`Warranty details for ${warranty.productName} downloaded`)
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
        ? `Reminder for ${warranty.productName} turned off`
        : `Reminder for ${warranty.productName} set`,
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
            <button className={styles.sortButton} onClick={() => handleSort("productName")} aria-label="Sort by name">
              <span>Name</span>
              {sortBy === "productName" && (sortDirection === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />)}
            </button>
            <button
              className={styles.sortButton}
              onClick={() => handleSort("expiryDate")}
              aria-label="Sort by expiry date"
            >
              <span>Expiry</span>
              {sortBy === "expiryDate" && (sortDirection === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />)}
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
              onClick={() => handleCardFlip(warranty.id)}
            >
              <div className={styles.cardInner}>
                {/* Front of card */}
                <div className={styles.cardFront}>
                  <div className={styles.cardHeader}>
                    <img
                      src={warranty.image || "/placeholder.svg?height=200&width=300"}
                      alt={warranty.productName}
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
                    <h3 className={styles.productName}>{warranty.productName}</h3>
                    <p className={styles.brand}>
                      {warranty.brand} {warranty.model}
                    </p>
                    <div className={styles.dateInfo}>
                      <div className={styles.date}>
                        <Calendar className={styles.dateIcon} />
                        <span>Expires: {new Date(warranty.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`${styles.status} ${styles[warranty.status]}`}>
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
                  <button className={styles.backButton} onClick={() => handleCardFlip(warranty.id)}>
                    <ChevronLeft className={styles.backIcon} />
                    Back
                  </button>
                  <h3 className={styles.backTitle}>{warranty.productName}</h3>
                  <div className={styles.backContent}>
                    <p>
                      <strong>Brand:</strong> {warranty.brand}
                    </p>
                    <p>
                      <strong>Model:</strong> {warranty.model}
                    </p>
                    <p>
                      <strong>Serial Number:</strong> {warranty.serialNumber}
                    </p>
                    <p>
                      <strong>Purchase Date:</strong> {new Date(warranty.purchaseDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Expiry Date:</strong> {new Date(warranty.expiryDate).toLocaleDateString()}
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

