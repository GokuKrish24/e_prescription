// // src/components/PharmacyDashboard.js
// import React from 'react';

// const PharmacyDashboard = () => {
//     return (
//         <div>
//             <h2>Pharmacy Dashboard</h2>
//             <p>Welcome, Pharmacy! Here you can manage prescriptions and mark them as delivered.</p>
//         </div>
//     );
// };

// export default PharmacyDashboard;

// src/components/PharmacyDashboard.js

import React from 'react';
import { FaCapsules, FaCheckCircle } from 'react-icons/fa';

const PharmacyDashboard = () => {
    return (
        <div style={styles.dashboardContainer}>
            <h2 style={styles.header}>Pharmacy Dashboard</h2>
            <p style={styles.welcomeText}>
                <FaCapsules style={styles.icon} /> Welcome, Pharmacy! Here you can manage prescriptions and mark them as delivered.
            </p>
            <div style={styles.card}>
                <p>Manage Prescriptions</p>
                <button style={styles.button}>
                    Mark as Delivered <FaCheckCircle style={styles.buttonIcon} />
                </button>
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        padding: '20px',
        backgroundColor: '#f0f4f8',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '20px auto',
    },
    header: {
        color: '#2c7be5',
        fontSize: '1.8em',
        marginBottom: '10px',
    },
    welcomeText: {
        fontSize: '1.1em',
        color: '#555',
    },
    icon: {
        color: '#2c7be5',
        marginRight: '5px',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        margin: '20px 0',
        transition: 'transform 0.3s',
    },
    button: {
        backgroundColor: '#2c7be5',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1em',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'background-color 0.3s, transform 0.3s',
    },
    buttonIcon: {
        marginLeft: '8px',
    }
};

// Animation hover effects for the button
styles.button[':hover'] = {
    backgroundColor: '#1a5bbd',
    transform: 'scale(1.05)',
};

styles.card[':hover'] = {
    transform: 'translateY(-5px)',
};

export default PharmacyDashboard;
