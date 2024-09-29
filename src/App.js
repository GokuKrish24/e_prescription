// src/App.js
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import the login component
import PatientDashboard from './components/PatientDashboard'; // Import the patient dashboard
import DoctorDashboard from './components/DoctorDashboard'; // Import the doctor dashboard
import PharmacyDashboard from './components/PharmacyDashboard'; // Import the pharmacy dashboard

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(''); // Add state to store user role

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

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to={`/${userRole}Dashboard`} /> : <Login web3={web3} setContract={setContract} setAccount={setAccount} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
                />
                <Route path="/patientDashboard" element={isLoggedIn && userRole === 'patient' ? <PatientDashboard /> : <Navigate to="/" />} />
                <Route path="/doctorDashboard" element={isLoggedIn && userRole === 'doctor' ? <DoctorDashboard /> : <Navigate to="/" />} />
                <Route path="/pharmacyDashboard" element={isLoggedIn && userRole === 'pharmacy' ? <PharmacyDashboard /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
