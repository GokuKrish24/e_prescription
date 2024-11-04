import React, { useState } from 'react';
import Web3 from 'web3';
import '../styles/styles.css';
import UserLoginArtifact from '../contracts/UserLogin.json';

const contractAddress = "0x267b003DE19d953c3b3eA413CdF4852f86A9976f";

const Login = ({ web3, setContract, setAccount, setIsLoggedIn, setUserRole, onLogout }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (web3 && username && password && role) {
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(UserLoginArtifact.abi, contractAddress);
            setContract(contract);
            try {
                const result = await contract.methods.login(username, password, role).call({ from: accounts[0] });
                if (result) {
                    alert('Login successful!');
                    setIsLoggedIn(true);
                    setUserRole(role.toLowerCase());
                    
                    // Save user credentials to localStorage
                    localStorage.setItem('username', username);
                    localStorage.setItem('account', accounts[0]);
                    localStorage.setItem('role', role.toLowerCase());
                } else {
                    setErrorMessage('Login failed. Please check your credentials.');
                }
            } catch (error) {
                setErrorMessage('Login failed. Error: ' + error.message);
            }
        } else {
            setErrorMessage('Please fill in all fields.');
        }
    };

    const handleRegister = async () => {
        if (web3 && username && password && role) {
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(UserLoginArtifact.abi, contractAddress);
            setContract(contract);
            try {
                if (role === 'patient') {
                    await contract.methods.registerPatient(username, password).send({ from: accounts[0] });
                    alert('Patient registered successfully!');
                } else {
                    setErrorMessage('Only patients can register themselves. Contact admin for other roles.');
                }
            } catch (error) {
                setErrorMessage('Registration failed. Error: ' + error.message);
            }
        } else {
            setErrorMessage('Please fill in all fields.');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 login-card" style={styles.card}>
                <h1 className="text-center" style={styles.heading}>User Login</h1>
                {errorMessage && <div className="alert alert-danger text-center" style={styles.errorMessage}>{errorMessage}</div>}
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="pharmacy">Pharmacy</option>
                    </select>
                </div>
                <button className="btn btn-primary btn-block mb-2" onClick={handleLogin} style={styles.loginButton}>Login</button>
                {role === 'patient' && (
                    <button className="btn btn-secondary btn-block" onClick={handleRegister} style={styles.registerButton}>Register</button>
                )}
                {/* {setIsLoggedIn && (
                    <button className="btn btn-danger btn-block" onClick={onLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                )} */}
            </div>
        </div>
    );
};

const styles = {
    card: {
        maxWidth: '400px',
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#ffffff',
    },
    heading: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    errorMessage: {
        fontWeight: 'bold',
        color: '#d9534f',
    },
    loginButton: {
        backgroundColor: '#007bff',
        border: 'none',
        transition: 'background-color 0.3s',
    },
    registerButton: {
        backgroundColor: '#6c757d',
        border: 'none',
        transition: 'background-color 0.3s',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        border: 'none',
        transition: 'background-color 0.3s',
    },
};

export default Login;


