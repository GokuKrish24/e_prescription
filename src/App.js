// src/App.js
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientDashboard from './components/PatientDashboard'; // Import PatientDashboard component
import DoctorDashboard from './components/DoctorDashboard'; // Import DoctorDashboard component
import PharmacyDashboard from './components/PharmacyDashboard'; // Import PharmacyDashboard component
import Login from './components/Login'; // Import Login component
import Navbar from './components/Navbar'; // Import Navbar component

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(''); // State for the role

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
                setWeb3(web3Instance);
            } else {
                alert('Please install MetaMask!');
            }
        };
        initWeb3();
    }, []);

    // Handle logging out
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(''); // Clear the user role
    };

    const renderDashboard = () => {
        switch (userRole) {
            case 'patient':
                return <PatientDashboard />;
            case 'doctor':
                return <DoctorDashboard />;
            case 'pharmacy':
                return <PharmacyDashboard />;
            default:
                return <Navigate to="/" />;
        }
    };

    return (
        <Router>
            {/* Navbar will be shown only if the user is logged in */}
            {isLoggedIn && <Navbar account={account} onLogout={handleLogout} />}

            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            renderDashboard()
                        ) : (
                            <Login
                                web3={web3}
                                setContract={setContract}
                                setAccount={setAccount}
                                setIsLoggedIn={setIsLoggedIn}
                                setUserRole={setUserRole}
                            />
                        )
                    }
                />
                <Route path="/dashboard" element={isLoggedIn ? renderDashboard() : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
