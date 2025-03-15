"use client"

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Lock, Database, Cpu } from 'lucide-react';
import styles from './ReceiptAnimation.module.css';

const ReceiptToBlockchainAnimation = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],  // Changed to start from viewport top for better control
    smooth: 0.1  // Added smoothing to prevent jumpiness with small scrolls
  });

  // Adjusted thresholds for smoother transitions
  const receiptOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0], { 
    clamp: true 
  });
  const blockchainOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 1], { 
    clamp: true 
  });
  const receiptScale = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1.05, 0.9], { 
    clamp: true 
  });
  const receiptRotateY = useTransform(scrollYProgress, [0.15, 0.3], [0, 180], { 
    clamp: true 
  });
  
  // Track animation state with debounced updates
  const [animationPhase, setAnimationPhase] = useState('receipt');
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Ensure receipt is shown at first render before any scrolling
    if (!isInitialized) {
      setAnimationPhase('receipt');
      setIsInitialized(true);
    }
    
    let debounceTimer;
    
    const handleScrollChange = (value) => {
      // Clear previous timer to prevent multiple rapid updates
      clearTimeout(debounceTimer);
      
      // Debounce the animation state change to reduce performance load
      debounceTimer = setTimeout(() => {
        if (value < 0.2) {
          setAnimationPhase('receipt');
        } else if (value >= 0.2 && value < 0.3) {
          setAnimationPhase('transition');
        } else {
          setAnimationPhase('blockchain');
        }
      }, 10); // Small timeout for debouncing
    };
    
    const unsubscribe = scrollYProgress.onChange(handleScrollChange);
    
    return () => {
      unsubscribe();
      clearTimeout(debounceTimer);
    };
  }, [scrollYProgress, isInitialized]);

  return (
    <div ref={containerRef} className={styles.animationContainer}>
      <div className={styles.animationStage}>
        {/* Original Receipt - Using display conditionals to improve performance */}
        <motion.div 
          className={styles.receipt}
          style={{
            opacity: receiptOpacity,
            scale: receiptScale,
            rotateY: receiptRotateY,
            display: animationPhase === 'blockchain' ? 'none' : 'block',
            // Remove rotateX for simpler animation and better performance
          }}
          initial={{ opacity: 1 }} // Ensure visible at start
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

        {/* Digital Lines Animation - Optimized for better performance */}
        <motion.div 
          className={styles.digitalLines}
          style={{
            opacity: useTransform(scrollYProgress, [0.15, 0.2, 0.25, 0.3], [0, 1, 1, 0], { clamp: true }),
            display: animationPhase === 'receipt' && scrollYProgress.get() < 0.15 ? 'none' : 'block'
          }}
        >
          {/* Reduced number of lines for better performance */}
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i} 
              className={styles.digitalLine}
              initial={{ x: "-100%", opacity: 0 }}
              animate={animationPhase === 'transition' ? { 
                x: "100%", 
                opacity: [0, 1, 1, 0],
                transition: { 
                  duration: 1.5, // Slightly longer for smoother appearance
                  repeat: Infinity, 
                  delay: i * 0.1, // Slightly increased delay
                  ease: "linear" // Linear movement for smoother transition
                }
              } : {}}
            />
          ))}
        </motion.div>

        {/* Blockchain Representation */}
        <motion.div 
          className={styles.blockchain}
          style={{
            opacity: blockchainOpacity,
            display: animationPhase === 'receipt' ? 'none' : 'flex',
            willChange: 'opacity', // Performance optimization
          }}
        >
          <div className={styles.blockchainHeader}>
            <h3>Blockchain Receipt</h3>
            <Cpu size={24} />
          </div>
          
          {/* Blockchain nodes - Optimized animations */}
          <div className={styles.blockchainNodes}>
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className={styles.blockchainNode}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={animationPhase === 'blockchain' ? { 
                  scale: [0.95, 1, 0.95], 
                  opacity: [0.8, 1, 0.8],
                  transition: { 
                    duration: 3,
                    repeat: Infinity, 
                    delay: i * 0.8,
                    ease: "easeInOut" // Smoother easing
                  }
                } : {}}
              >
                <div className={styles.nodeIcon}>
                  <Database size={20} />
                </div>
                <div className={styles.nodeContent}>
                  <div className={styles.nodeHeader}>Block #{i+1}</div>
                  {/* Pre-generated hash to avoid re-renders */}
                  <div className={styles.nodeHash}>0x{(i + 1) * 28431 + 'abc'}</div>
                  <div className={styles.nodeData}>
                    <div>Product: Samsung TV</div>
                    <div>SN: SN1234567890</div>
                    <div>Valid: 3 years</div>
                  </div>
                </div>
                {i < 2 && <div className={styles.nodeConnector} />}
              </motion.div>
            ))}
          </div>
          
          <div className={styles.blockchainFooter}>
            <div className={styles.securityBadge}>
              <Lock size={16} />
              <span>Immutable & Secure</span>
            </div>
          </div>
        </motion.div>
        
        {/* Floating particles - Reduced count and complexity for better performance */}
        <motion.div 
          className={styles.particles}
          style={{
            opacity: blockchainOpacity,
            display: animationPhase === 'blockchain' ? 'block' : 'none'
          }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i} 
              className={styles.particle}
              initial={{ 
                x: Math.random() * 300 - 150, 
                y: Math.random() * 300 - 150,
                opacity: 0
              }}
              animate={animationPhase === 'blockchain' ? { 
                x: Math.random() * 300 - 150,
                y: Math.random() * 300 - 150,
                opacity: [0, 0.7, 0],
                transition: { 
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }
              } : {}}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiptToBlockchainAnimation;