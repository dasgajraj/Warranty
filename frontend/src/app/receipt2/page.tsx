"use client"
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Database, Cpu } from 'lucide-react';
import styles from './ReceiptToBlockchainAnimation.module.css';

const ReceiptToBlockchainAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState('receipt');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Toggle between receipt and blockchain every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      // First show the transition effect for 1.5 seconds
      setTimeout(() => {
        setAnimationPhase(prev => prev === 'receipt' ? 'blockchain' : 'receipt');
        
        // Then hide the transition effect after the view has changed
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 1500);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.animationContainer}>
      <div className={styles.heroVisual}>
        {/* Traditional Receipt */}
        <AnimatePresence>
          {animationPhase === 'receipt' && (
            <motion.div 
              className={styles.receipt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.receiptContent}>
                <div className={styles.receiptHeader}>
                  <h3 className={styles.receiptHeaderTitle}>Warranty Receipt</h3>
                  <div className={styles.receiptLogo}>
                    <Shield size={24} />
                  </div>
                </div>
                <div className={styles.receiptDivider}></div>
                <div className={styles.receiptItem}>
                  <span>Product:</span>
                  <span>Samsung 4K QLED TV</span>
                </div>
                <div className={styles.receiptItem}>
                  <span>Serial No:</span>
                  <span>SN1234567890</span>
                </div>
                <div className={styles.receiptItem}>
                  <span>Purchase Date:</span>
                  <span>2023-01-15</span>
                </div>
                <div className={styles.receiptItem}>
                  <span>Warranty Until:</span>
                  <span>2026-01-15</span>
                </div>
                <div className={styles.receiptDivider}></div>
                <div className={styles.receiptFooter}>
                  <div className={styles.blockchainStamp}>
                    <Lock size={16} />
                    <span>Blockchain Verified</span>
                  </div>
                  <div className={styles.receiptBarcode}></div>
                </div>
              </div>
              <div className={styles.receiptShadow}></div>
              <div className={styles.receiptReflection}></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Digital Lines Animation (transition phase) */}
        {isTransitioning && (
          <div className={styles.digitalLines}>
            {[...Array(15)].map((_, i) => (
              <motion.div 
                key={i} 
                className={styles.digitalLine}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ 
                  x: "100%", 
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ 
                  duration: 1.2,
                  delay: i * 0.08
                }}
              />
            ))}
          </div>
        )}

        {/* Blockchain Representation */}
        <AnimatePresence>
          {animationPhase === 'blockchain' && (
            <motion.div 
              className={styles.blockchain}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.blockchainHeader}>
                <h3>Blockchain Receipt</h3>
                <Cpu size={24} />
              </div>
              
              {/* Blockchain nodes */}
              <div className={styles.blockchainNodes}>
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className={styles.node}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ 
                      scale: [0.95, 1, 0.95], 
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity, 
                      delay: i * 0.3
                    }}
                  >
                    <div className={styles.nodeInner}>
                      <Database size={18} />
                      <div className={styles.nodeContent}>
                        <div className={styles.nodeHeader}>Block #{i+1}</div>
                        <div className={styles.nodeHash}>0x{Math.random().toString(16).substring(2, 10)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className={styles.nodeConnection}
                    initial={{ opacity: 0.6 }}
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ 
                      duration: 1.8,
                      repeat: Infinity, 
                      delay: i * 0.2 + 0.1
                    }}
                  />
                ))}
              </div>
              
              <div className={styles.blockchainFooter}>
                <div className={styles.securityBadge}>
                  <Lock size={16} />
                  <span>Immutable & Secure</span>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className={styles.particles}>
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className={styles.particle}
                    initial={{ 
                      x: Math.random() * 400 - 200, 
                      y: Math.random() * 400 - 200,
                      opacity: 0
                    }}
                    animate={{ 
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{ 
                      duration: 2.5 + Math.random() * 1.5,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text explanations for each phase */}
      <AnimatePresence>
        {animationPhase === 'receipt' && (
          <motion.div 
            className={styles.explanationText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Traditional Receipt</h2>
            <p>Paper receipts are easily lost, damaged, or counterfeited.</p>
          </motion.div>
        )}
        
        {animationPhase === 'blockchain' && (
          <motion.div 
            className={styles.explanationText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Blockchain Verified</h2>
            <p>Immutable, secure, and instantly verifiable warranty information.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceiptToBlockchainAnimation;