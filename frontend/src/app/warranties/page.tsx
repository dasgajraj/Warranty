"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import AnimatedThemeToggle from "../components/animated-theme-toggle";
import { useAppSelector } from "../store/hooks";
import styles from "./warranties.module.css";
import { fetchWarranties, Warranty as ApiWarranty } from "../api/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

// Warranty type definition
interface Warranty {
  id: number;
  productName: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  expiryDate: string;
  status: string;
  image: string;
  notes?: string;
  reminderSet?: boolean;
  ipfsHash?: string;
}

export default function WarrantiesPage() {
  // Redux state
  const theme = useAppSelector((state) => state.theme.mode);
  
  // User state from Firebase
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [currentWarranty, setCurrentWarranty] = useState<Warranty | null>(null);
  const [sortBy, setSortBy] = useState<string>("expiryDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        console.log("Current user UID:", user.uid);
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  // Load data from API when auth state is determined
  useEffect(() => {
    const loadWarranties = async () => {
      if (authLoading) return; // Wait until auth state is determined
      
      if (!currentUser) {
        setWarranties([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const apiWarranties = await fetchWarranties();
        
        // Filter warranties for current user
        const userWarranties = apiWarranties.filter(
          (warranty) => warranty.user_uid === currentUser.uid
        );
        
        console.log(`Found ${userWarranties.length} warranties for user ${currentUser.uid}`);
        
        // Transform API data to match our component's Warranty interface
        const transformedWarranties = userWarranties.map((apiWarranty, index) => {
          // Determine warranty status based on end date
          const today = new Date();
          const expiryDate = new Date(apiWarranty.warranty_end_date);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          
          let status = "active";
          if (expiryDate < today) {
            status = "expired";
          } else if (expiryDate <= thirtyDaysFromNow) {
            status = "expiring-soon";
          }
          
          // Extract brand and model from product name (as a simple example)
          // In a real app, you might have these as separate fields in your API
          const nameParts = apiWarranty.product_name.split(' ');
          const brand = nameParts[0] || 'Unknown';
          const model = nameParts.slice(1).join(' ') || 'Unknown Model';
          
          return {
            id: index + 1,
            productName: apiWarranty.product_name,
            brand: brand,
            model: model,
            serialNumber: `SN${Math.floor(Math.random() * 10000000000)}`, // Placeholder
            purchaseDate: apiWarranty.uploaded_at.split('T')[0],
            expiryDate: apiWarranty.warranty_end_date,
            status: status,
            image: `/api/placeholder/400/320`, // Placeholder image
            notes: `Warranty information stored on IPFS`,
            reminderSet: false,
            ipfsHash: apiWarranty.ipfs_hash
          };
        });
        
        setWarranties(transformedWarranties);
        
        // Check for warranties expiring in the next 30 days
        const expiringWarranties = transformedWarranties.filter(
          (warranty) => warranty.status === "expiring-soon"
        );

        if (expiringWarranties.length > 0) {
          setNotificationMessage(
            `You have ${expiringWarranties.length} warranties expiring soon!`
          );
          setShowNotification(true);

          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      } catch (error) {
        console.error("Error loading warranties:", error);
        showNotificationMessage("Failed to load warranties");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWarranties();
  }, [authLoading, currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and sort warranties
  const processedWarranties = warranties
    .filter(
      (warranty) =>
        warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warranty.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warranty.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (warranty.serialNumber && warranty.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((warranty) => filter === "all" || warranty.status === filter)
    .sort((a, b) => {
      // Handle different sort fields
      if (sortBy === "expiryDate") {
        const dateA = new Date(a.expiryDate).getTime();
        const dateB = new Date(b.expiryDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "purchaseDate") {
        const dateA = new Date(a.purchaseDate).getTime();
        const dateB = new Date(b.purchaseDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Sort by product name
        const nameA = a.productName.toLowerCase();
        const nameB = b.productName.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (status: string) => {
    setFilter(status);
  };

  const handleCardFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  const handleDownload = (warranty: Warranty) => {
    // In a real application, this would retrieve the document from IPFS
    if (warranty.ipfsHash) {
      // Open IPFS gateway URL in a new tab
      const ipfsGatewayUrl = `https://ipfs.io/ipfs/${warranty.ipfsHash}`;
      window.open(ipfsGatewayUrl, '_blank');
      
      showNotificationMessage(
        `Opening warranty document for ${warranty.productName}`
      );
    } else {
      showNotificationMessage(
        `Warranty details for ${warranty.productName} downloaded`
      );
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleDropdownToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === id ? null : id);
  };
  
  const toggleReminder = (warranty: Warranty, e: React.MouseEvent) => {
    e.stopPropagation();
    setWarranties(
      warranties.map((w) =>
        w.id === warranty.id ? { ...w, reminderSet: !w.reminderSet } : w
      )
    );

    showNotificationMessage(
      warranty.reminderSet
        ? `Reminder for ${warranty.productName} turned off`
        : `Reminder for ${warranty.productName} set`
    );
    setShowDropdown(null);
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Show login message if no user
  if (!authLoading && !currentUser) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your Warranties</h1>
          <AnimatedThemeToggle />
        </header>
        <div className={styles.noResults}>
          <AlertCircle className={styles.noResultsIcon} />
          <p>Please log in to view your warranties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header with theme toggle */}
      <header className={styles.header}>
        <h1 className={styles.title}>Your Warranties</h1>
        <AnimatedThemeToggle />
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
            <button
              className={styles.clearSearch}
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                filter === "all" ? styles.active : ""
              }`}
              onClick={() => handleFilter("all")}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === "active" ? styles.active : ""
              }`}
              onClick={() => handleFilter("active")}
            >
              Active
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === "expiring-soon" ? styles.active : ""
              }`}
              onClick={() => handleFilter("expiring-soon")}
            >
              Expiring Soon
            </button>
          </div>

          <div className={styles.sortControls}>
            <button
              className={styles.sortButton}
              onClick={() => handleSort("productName")}
              aria-label="Sort by name"
            >
              <span>Name</span>
              {sortBy === "productName" &&
                (sortDirection === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                ))}
            </button>
            <button
              className={styles.sortButton}
              onClick={() => handleSort("expiryDate")}
              aria-label="Sort by expiry date"
            >
              <span>Expiry</span>
              {sortBy === "expiryDate" &&
                (sortDirection === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                ))}
            </button>
          </div>
        </div>
      </div>

      {/* Warranty cards grid */}
      <div className={styles.warrantyGrid}>
        {isLoading || authLoading ? (
          // Show skeleton loader while loading
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`${styles.warrantyCard} ${styles.skeleton}`}
            >
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
              className={`${styles.warrantyCard} ${
                flippedCard === warranty.id ? styles.flipped : ""
              }`}
              onClick={() => handleCardFlip(warranty.id)}
            >
              <div className={styles.cardInner}>
                {/* Front of card */}
                <div className={styles.cardFront}>
                  <div className={styles.cardHeader}>
                    <img
                      src={`/api/placeholder/400/320`}
                      alt={warranty.productName}
                      className={styles.productImage}
                    />

                    {/* Reminder indicator */}
                    {warranty.reminderSet && (
                      <div
                        className={styles.reminderBadge}
                        title="Reminder set"
                      >
                        <Bell size={14} />
                      </div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.productName}>
                      {warranty.productName}
                    </h3>
                    <p className={styles.brand}>
                      {warranty.brand} {warranty.model}
                    </p>
                    <div className={styles.dateInfo}>
                      <div className={styles.date}>
                        <Calendar className={styles.dateIcon} />
                        <span>
                          Expires:{" "}
                          {new Date(warranty.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`${styles.status} ${styles[warranty.status]}`}
                    >
                      {warranty.status === "active" && (
                        <CheckCircle className={styles.statusIcon} />
                      )}
                      {warranty.status === "expiring-soon" && (
                        <Clock className={styles.statusIcon} />
                      )}
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
                  <button
                    className={styles.backButton}
                    onClick={() => handleCardFlip(warranty.id)}
                  >
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
                      <strong>Purchase Date:</strong>{" "}
                      {new Date(warranty.purchaseDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Expiry Date:</strong>{" "}
                      {new Date(warranty.expiryDate).toLocaleDateString()}
                    </p>
                    {warranty.ipfsHash && (
                      <p>
                        <strong>IPFS Hash:</strong> {warranty.ipfsHash.substring(0, 10)}...
                      </p>
                    )}
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
                        e.stopPropagation();
                        toggleReminder(warranty, e);
                      }}
                    >
                      <Bell className={styles.reminderIcon} />
                      {warranty.reminderSet
                        ? "Remove Reminder"
                        : "Set Reminder"}
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(warranty);
                      }}
                    >
                      <Download className={styles.downloadIcon} />
                      {warranty.ipfsHash ? "View Document" : "Download"}
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
          <button
            className={styles.closeNotification}
            onClick={() => setShowNotification(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}