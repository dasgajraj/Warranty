"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

// Mock warranty data
const initialWarranties = [
  { id: 1, product: 'Laptop Model X', customer: 'John Smith', startDate: '2025-01-15', endDate: '2027-01-15', status: 'Active' },
  { id: 2, product: 'Smartphone Y-Series', customer: 'Emily Johnson', startDate: '2024-11-03', endDate: '2025-11-03', status: 'Active' },
  { id: 3, product: 'Refrigerator Z400', customer: 'Michael Brown', startDate: '2024-08-22', endDate: '2029-08-22', status: 'Active' },
  { id: 4, product: 'Television UHD-8000', customer: 'Sarah Davis', startDate: '2023-12-10', endDate: '2024-12-10', status: 'Expiring Soon' },
  { id: 5, product: 'Coffee Maker Pro', customer: 'Robert Wilson', startDate: '2023-05-17', endDate: '2024-05-17', status: 'Expired' },
];

export default function Dashboard() {
  const [warranties, setWarranties] = useState(initialWarranties);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter warranties based on search term
  const filteredWarranties = warranties.filter(warranty => 
    warranty.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warranty.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warranty.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count warranties by status
  const statusCounts = warranties.reduce((acc, warranty) => {
    acc[warranty.status] = (acc[warranty.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.companyName}>Hadn't @ 2025</h1>
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search warranties..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.userProfile}>
            <span className={styles.userName}>Admin</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Navigation Sidebar */}
        <nav className={styles.sidebar}>
          <ul className={styles.navMenu}>
            <li 
              className={`${styles.navItem} ${activeSection === 'dashboard' ? styles.active : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'warranties' ? styles.active : ''}`}
              onClick={() => setActiveSection('warranties')}
            >
              Warranties
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'customers' ? styles.active : ''}`}
              onClick={() => setActiveSection('customers')}
            >
              Customers
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'products' ? styles.active : ''}`}
              onClick={() => setActiveSection('products')}
            >
              Products
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </li>
          </ul>
        </nav>

        {/* Main Dashboard Area */}
        <div className={styles.dashboardContent}>
          <h2 className={styles.pageTitle}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>

          {activeSection === 'dashboard' && (
            <div className={styles.dashboardSummary}>
              <div className={styles.summaryCard}>
                <h3>Active Warranties</h3>
                <p className={styles.summaryNumber}>{statusCounts['Active'] || 0}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Expiring Soon</h3>
                <p className={styles.summaryNumber}>{statusCounts['Expiring Soon'] || 0}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Expired</h3>
                <p className={styles.summaryNumber}>{statusCounts['Expired'] || 0}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Total Warranties</h3>
                <p className={styles.summaryNumber}>{warranties.length}</p>
              </div>
            </div>
          )}

          {/* Warranty Table */}
          {(activeSection === 'dashboard' || activeSection === 'warranties') && (
            <div className={styles.warrantyTable}>
              <div className={styles.tableHeader}>
                <h3>{activeSection === 'dashboard' ? 'Recent Warranties' : 'All Warranties'}</h3>
                <button className={styles.addButton}>+ Add New Warranty</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarranties.map(warranty => (
                    <tr key={warranty.id}>
                      <td>{warranty.id}</td>
                      <td>{warranty.product}</td>
                      <td>{warranty.customer}</td>
                      <td>{warranty.startDate}</td>
                      <td>{warranty.endDate}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[warranty.status.replace(/\s+/g, '').toLowerCase()]}`}>
                          {warranty.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.editButton}>Edit</button>
                          <button className={styles.deleteButton}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Placeholder for other sections */}
          {activeSection === 'customers' && <div className={styles.placeholderSection}>Customers section content will appear here</div>}
          {activeSection === 'products' && <div className={styles.placeholderSection}>Products section content will appear here</div>}
          {activeSection === 'settings' && <div className={styles.placeholderSection}>Settings section content will appear here</div>}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.companyName}>Hadn't @ 2025</p>
          <p className={styles.copyright}>© 2025 Hadn't. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}