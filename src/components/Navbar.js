
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar = ({ account, onLogout }) => {
    return (
        <nav style={styles.navbar} className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard" style={styles.brand}>
                    E-Prescription System
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard" style={styles.navLink}>
                                <FaHome style={styles.icon} /> Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn" onClick={onLogout} style={styles.logoutButton}>
                                <FaSignOutAlt style={styles.icon} /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '10px 0',
    },
    brand: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    navLink: {
        color: '#007bff',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'color 0.3s',
    },
    logoutButton: {
        color: '#dc3545',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        transition: 'color 0.3s',
    },
    icon: {
        color: '#007bff',
    },
    accountText: {
        color: '#6c757d',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
};

export default Navbar;
