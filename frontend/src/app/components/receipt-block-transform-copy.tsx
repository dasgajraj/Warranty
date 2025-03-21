"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Shield, Lock, Database, CheckCircle } from "lucide-react"

interface BlockchainReceiptTransformProps {
  darkMode?: boolean
}

export default function BlockchainReceiptTransform({ darkMode = false }: BlockchainReceiptTransformProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Handle scroll-based animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const scrollThreshold = window.innerHeight * 0.3

      if (rect.top < scrollThreshold) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Trigger animation when either hovered or scrolled
  useEffect(() => {
    if (isHovered || isScrolled) {
      controls.start("block")
    } else {
      controls.start("receipt")
    }
  }, [isHovered, isScrolled, controls])

  // Animation variants
  const containerVariants = {
    receipt: {
      rotateY: 0,
      rotateX: 0,
      z: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    block: {
      rotateY: 15,
      rotateX: 10,
      z: 50,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const receiptVariants = {
    receipt: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    block: {
      opacity: 0,
      scale: 0.8,
      rotateY: -90,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const blockVariants = {
    receipt: {
      opacity: 0,
      scale: 0.8,
      rotateY: 90,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    block: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  }

  // Blockchain connection animation
  const chainLinkVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1200px",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Blockchain connection lines */}
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
        initial="hidden"
        animate={isHovered || isScrolled ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Previous block connection */}
        <motion.div
          style={{
            position: "absolute",
            left: "20%",
            top: "50%",
            width: "80px",
            height: "3px",
            background: darkMode
              ? "linear-gradient(90deg, rgba(108, 99, 255, 0.8), rgba(108, 99, 255, 0.2))"
              : "linear-gradient(90deg, rgba(108, 99, 255, 0.8), rgba(108, 99, 255, 0.2))",
            transformOrigin: "left center",
          }}
          variants={chainLinkVariants}
        />

        {/* Next block connection */}
        <motion.div
          style={{
            position: "absolute",
            right: "20%",
            top: "50%",
            width: "80px",
            height: "3px",
            background: darkMode
              ? "linear-gradient(90deg, rgba(108, 99, 255, 0.2), rgba(108, 99, 255, 0.8))"
              : "linear-gradient(90deg, rgba(108, 99, 255, 0.2), rgba(108, 99, 255, 0.8))",
            transformOrigin: "right center",
          }}
          variants={chainLinkVariants}
        />

        {/* Previous block node */}
        <motion.div
          style={{
            position: "absolute",
            left: "18%",
            top: "50%",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "#6c63ff",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 10px rgba(108, 99, 255, 0.5)",
          }}
          variants={chainLinkVariants}
        />

        {/* Next block node */}
        <motion.div
          style={{
            position: "absolute",
            right: "18%",
            top: "50%",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "#6c63ff",
            transform: "translate(50%, -50%)",
            boxShadow: "0 0 10px rgba(108, 99, 255, 0.5)",
          }}
          variants={chainLinkVariants}
        />
      </motion.div>

      <motion.div
        style={{
          position: "relative",
          width: "300px",
          height: "400px",
          transformStyle: "preserve-3d",
          zIndex: 5,
        }}
        variants={containerVariants}
        animate={controls}
      >
        {/* Receipt */}
        <motion.div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          variants={receiptVariants}
          animate={controls}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#333" }}>Warranty Receipt</h3>
            <Shield size={24} color="#6c63ff" />
          </div>

          <div
            style={{
              width: "100%",
              height: "2px",
              background: "repeating-linear-gradient(90deg, #ccc, #ccc 5px, transparent 5px, transparent 10px)",
              margin: "8px 0 16px",
            }}
          />

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <span>Product:</span>
              <span>Samsung 4K QLED TV</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <span>Serial No:</span>
              <span>SN1234567890</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <span>Purchase Date:</span>
              <span>2023-01-15</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" }}>
              <span>Warranty Until:</span>
              <span>2026-01-15</span>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "rgba(108, 99, 255, 0.1)",
                borderRadius: "9999px",
                width: "fit-content",
                margin: "0 auto 16px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6c63ff",
              }}
            >
              <Lock size={14} />
              <span>Blockchain Verified</span>
            </div>

            <div
              style={{
                width: "80%",
                height: "40px",
                margin: "0 auto",
                background: "repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px)",
                borderRadius: "4px",
              }}
            />
          </div>
        </motion.div>

        {/* Blockchain Block */}
        <motion.div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            transformStyle: "preserve-3d",
          }}
          variants={blockVariants}
          animate={controls}
        >
          {/* Main block face */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: darkMode ? "#2a2a2a" : "#f8f8f8",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.15),
              0 0 0 1px ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"},
              inset 0 1px 0 ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"},
              inset 0 -1px 0 ${darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)"}
            `,
              display: "flex",
              flexDirection: "column",
              transformStyle: "preserve-3d",
              transform: "translateZ(0px)",
            }}
          >
            {/* Hexagonal shape overlay */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)",
                }}
              />

              {/* Hexagon corners */}
              <div
                style={{
                  position: "absolute",
                  top: "-5px",
                  left: "50%",
                  width: "10px",
                  height: "10px",
                  transform: "translateX(-50%) rotate(45deg)",
                  background: darkMode ? "#2a2a2a" : "#f8f8f8",
                  boxShadow: `0 0 0 1px ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "-5px",
                  left: "50%",
                  width: "10px",
                  height: "10px",
                  transform: "translateX(-50%) rotate(45deg)",
                  background: darkMode ? "#2a2a2a" : "#f8f8f8",
                  boxShadow: `0 0 0 1px ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                }}
              />
            </div>

            {/* Block content */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: darkMode ? "#fff" : "#000",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <Database size={16} />
                <span>Block #1337</span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  padding: "4px 8px",
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                  borderRadius: "4px",
                  color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                }}
              >
                0x8F4D2A7B
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Previous hash */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                <span style={{ color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}>Prev Hash:</span>
                <span style={{ color: darkMode ? "#fff" : "#000" }}>0xA1B2C3D4...</span>
              </div>

              {/* Data rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Product", value: "Samsung 4K QLED TV" },
                  { label: "Serial No", value: "SN1234567890" },
                  { label: "Purchase Date", value: "2023-01-15" },
                  { label: "Warranty Until", value: "2026-01-15" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                      borderRadius: "8px",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                      transform: "translateX(-5px)",
                      opacity: 0.8,
                      boxShadow: "none",
                    }}
                    animate={{
                      transform: isHovered || isScrolled ? "translateX(0)" : "translateX(-5px)",
                      opacity: isHovered || isScrolled ? 1 : 0.8,
                      boxShadow:
                        isHovered || isScrolled
                          ? `0 2px 8px ${darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"}`
                          : "none",
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span
                      style={{
                        color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                        fontSize: "14px",
                      }}
                    >
                      {item.label}:
                    </span>
                    <span
                      style={{
                        color: darkMode ? "#fff" : "#000",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}
                    >
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "16px",
                borderTop: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  backgroundColor: "rgba(76, 175, 80, 0.2)",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  color: "#4caf50",
                  fontWeight: 500,
                }}
              >
                <CheckCircle size={12} />
                <span>Verified</span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                }}
              >
                Timestamp: 1678912345
              </div>
            </div>

            {/* Connection points */}
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "50%",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#6c63ff",
                transform: "translateY(-50%)",
                boxShadow: "0 0 10px rgba(108, 99, 255, 0.5)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: darkMode ? "#2a2a2a" : "#f8f8f8",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                right: "-8px",
                top: "50%",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#6c63ff",
                transform: "translateY(-50%)",
                boxShadow: "0 0 10px rgba(108, 99, 255, 0.5)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: darkMode ? "#2a2a2a" : "#f8f8f8",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>

          {/* 3D edges */}
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "10px",
              right: "10px",
              height: "10px",
              background: darkMode ? "#222" : "#e0e0e0",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              transform: "rotateX(-90deg)",
              transformOrigin: "top",
              boxShadow: `0 10px 30px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.1"})`,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "-10px",
              bottom: "10px",
              width: "10px",
              background: darkMode ? "#333" : "#e8e8e8",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              transform: "rotateY(90deg)",
              transformOrigin: "left",
            }}
          />
        </motion.div>

        {/* Floating particles for blockchain effect */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#6c63ff",
              top: `${20 + i * 10}%`,
              right: `-${10 + Math.random() * 20}px`,
              opacity: 0,
            }}
            animate={
              isHovered || isScrolled
                ? {
                    opacity: [0, 0.8, 0],
                    x: [0, -30],
                    transition: {
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    },
                  }
                : {
                    opacity: 0,
                  }
            }
          />
        ))}

        {/* Glow effect */}
        <motion.div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            background: "radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.2), transparent 70%)",
            opacity: 0,
            pointerEvents: "none",
          }}
          animate={
            isHovered || isScrolled
              ? {
                  opacity: 0.7,
                  transition: { duration: 0.5 },
                }
              : {
                  opacity: 0,
                  transition: { duration: 0.5 },
                }
          }
        />
      </motion.div>

      {/* Instructions text */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
          opacity: 0,
          zIndex: 10,
        }}
        animate={
          !isHovered && !isScrolled
            ? {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 1 },
              }
            : {
                opacity: 0,
                y: 10,
                transition: { duration: 0.3 },
              }
        }
      >
        Hover over receipt or scroll down to transform
      </motion.div>
    </div>
  )
}

