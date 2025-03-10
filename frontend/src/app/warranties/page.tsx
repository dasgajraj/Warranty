"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, MoreVertical, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"
import styles from "./warranties.module.css"

// Mock data for warranties
const mockWarranties = [
  {
    id: 1,
    productName: "Samsung 4K QLED TV",
    brand: "Samsung",
    purchaseDate: "2023-01-15",
    expiryDate: "2026-01-15",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    productName: 'MacBook Pro 16"',
    brand: "Apple",
    purchaseDate: "2022-11-30",
    expiryDate: "2025-11-30",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
  },
  {
    id: 3,
    productName: "Dyson V11 Vacuum",
    brand: "Dyson",
    purchaseDate: "2022-08-01",
    expiryDate: "2024-08-01",
    status: "expiring-soon",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 4,
    productName: "Sony WH-1000XM4 Headphones",
    brand: "Sony",
    purchaseDate: "2022-03-15",
    expiryDate: "2024-03-15",
    status: "expiring-soon",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80",
  },
  {
    id: 5,
    productName: "LG French Door Refrigerator",
    brand: "LG",
    purchaseDate: "2021-12-01",
    expiryDate: "2026-12-01",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1628961210437-1d885a944d26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 6,
    productName: "Nikon Z6 II Camera",
    brand: "Nikon",
    purchaseDate: "2022-06-20",
    expiryDate: "2024-06-20",
    status: "expiring-soon",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
  },
]

export default function WarrantiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [warranties, setWarranties] = useState(mockWarranties)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const filteredWarranties = warranties.filter(
    (warranty) =>
      warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "all" || warranty.status === filter),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilter = (status: string) => {
    setFilter(status)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Warranties</h1>
        <button className={styles.addButton}>
          <Plus className={styles.addIcon} />
          Add Warranty
        </button>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search warranties..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
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
      </div>

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
        ) : filteredWarranties.length > 0 ? (
          filteredWarranties.map((warranty) => (
            <div key={warranty.id} className={styles.warrantyCard}>
              <div className={styles.cardHeader}>
                <img
                  src={warranty.image || "/placeholder.svg"}
                  alt={warranty.productName}
                  className={styles.productImage}
                />
                <button className={styles.moreButton}>
                  <MoreVertical className={styles.moreIcon} />
                </button>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.productName}>{warranty.productName}</h3>
                <p className={styles.brand}>{warranty.brand}</p>
                <div className={styles.dateInfo}>
                  <div className={styles.date}>
                    <Calendar className={styles.dateIcon} />
                    <span>Purchased: {new Date(warranty.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.date}>
                    <Calendar className={styles.dateIcon} />
                    <span>Expires: {new Date(warranty.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`${styles.status} ${styles[warranty.status]}`}>
                  {warranty.status === "active" && <CheckCircle className={styles.statusIcon} />}
                  {warranty.status === "expiring-soon" && <Clock className={styles.statusIcon} />}
                  <span>{warranty.status === "active" ? "Active" : "Expiring Soon"}</span>
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
    </div>
  )
}

