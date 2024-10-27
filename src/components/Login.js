// src/components/Login.js
import React, { useState } from 'react';
import Web3 from 'web3';
import '../styles/styles.css';
import UserLoginArtifact from '../contracts/UserLogin.json'; // Updated path

const contractAddress = "0xF9FBE6180B84715987d101de6D07128feC7b1d49"; // Replace with your actual contract address

const Login = ({ web3, setContract, setAccount, setIsLoggedIn, setUserRole }) => {
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
                    setUserRole(role.toLowerCase()); // Set the role for routing (always lowercase)
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
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 login-card" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-center">User Login</h1>
                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
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
                <button className="btn btn-primary btn-block mb-2" onClick={handleLogin}>Login</button>
                {/* Show register button only if role is patient */}
                {role === 'patient' && (
                    <button className="btn btn-secondary btn-block" onClick={handleRegister}>Register</button>
                )}
            </div>
        </div>
    );
};

export default Login;
