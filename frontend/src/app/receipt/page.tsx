"use client"

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Lock, Database, Cpu } from 'lucide-react';
import styles from './ReceiptAnimation.module.css';

const ReceiptToBlockchainAnimation = ({ speed = 1 }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    smooth: 0.01 / speed  // Adjust smoothing based on speed
  });

  // Animation ranges adjusted by speed factor
  const receiptOpacity = useTransform(scrollYProgress, [0, 0.08 / speed, 0.15 / speed], [1, 1, 0], { 
    clamp: true 
  });
  const blockchainOpacity = useTransform(scrollYProgress, [0.12 / speed, 0.18 / speed, 0.25 / speed], [0, 1, 1], { 
    clamp: true 
  });
  const receiptScale = useTransform(scrollYProgress, [0, 0.08 / speed, 0.15 / speed], [1, 1.05, 0.9], { 
    clamp: true 
  });
  const receiptRotateY = useTransform(scrollYProgress, [0.05 / speed, 0.15 / speed], [0, 180], { 
    clamp: true 
  });
  
  const [animationPhase, setAnimationPhase] = useState('receipt');
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) {
      setAnimationPhase('receipt');
      setIsInitialized(true);
    }
    
    // Adjust thresholds based on speed
    const handleScrollChange = (value) => {
      if (value < 0.08 / speed) {
        setAnimationPhase('receipt');
      } else if (value >= 0.08 / speed && value < 0.15 / speed) {
        setAnimationPhase('transition');
      } else {
        setAnimationPhase('blockchain');
      }
    };
    
    const unsubscribe = scrollYProgress.onChange(handleScrollChange);
    
    return () => {
      unsubscribe();
    };
  }, [scrollYProgress, isInitialized, speed]);

  // Calculate animation durations based on speed
  const calculateDuration = (baseDuration) => baseDuration / speed;

  return (
    <div ref={containerRef} className={styles.animationContainer}>
      <div className={styles.animationStage}>
        {/* Original Receipt */}
        <motion.div 
          className={styles.receipt}
          style={{
            opacity: receiptOpacity,
            scale: receiptScale,
            rotateY: receiptRotateY,
            display: animationPhase === 'blockchain' ? 'none' : 'block',
          }}
          initial={{ opacity: 1 }}
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

        {/* Digital Lines Animation */}
        <motion.div 
          className={styles.digitalLines}
          style={{
            opacity: useTransform(scrollYProgress, [0.05 / speed, 0.08 / speed, 0.12 / speed, 0.15 / speed], [0, 1, 1, 0], { clamp: true }),
            display: animationPhase === 'receipt' && scrollYProgress.get() < 0.05 / speed ? 'none' : 'block'
          }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i} 
              className={styles.digitalLine}
              initial={{ x: "-100%", opacity: 0 }}
              animate={animationPhase === 'transition' ? { 
                x: "100%", 
                opacity: [0, 1, 1, 0],
                transition: { 
                  duration: calculateDuration(0.6), // Speed-adjusted animation
                  repeat: Infinity, 
                  delay: i * calculateDuration(0.04), // Speed-adjusted delay
                  ease: "linear"
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
            willChange: 'opacity',
          }}
        >
          <div className={styles.blockchainHeader}>
            <h3>Blockchain Receipt</h3>
            <Cpu size={24} />
          </div>
          
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
                    duration: calculateDuration(1.5), // Speed-adjusted animation
                    repeat: Infinity, 
                    delay: i * calculateDuration(0.2), // Speed-adjusted delay
                    ease: "easeInOut"
                  }
                } : {}}
              >
                <div className={styles.nodeIcon}>
                  <Database size={20} />
                </div>
                <div className={styles.nodeContent}>
                  <div className={styles.nodeHeader}>Block #{i+1}</div>
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
        
        {/* Floating particles */}
        <motion.div 
          className={styles.particles}
          style={{
            opacity: blockchainOpacity,
            display: animationPhase === 'blockchain' ? 'block' : 'none'
          }}
        >
          {[...Array(10)].map((_, i) => (
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
                  duration: calculateDuration(1 + (i % 2)), // Speed-adjusted animation
                  repeat: Infinity,
                  delay: i * calculateDuration(0.1), // Speed-adjusted delay
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