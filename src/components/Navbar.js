import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ account, onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">
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
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn" onClick={onLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
                <span className="navbar-text">
                    Account: {account}
                </span>
            </div>
        </nav>
    );
};

export default Navbar;
