// src/components/Login.js
import React, { useState } from 'react';
import Web3 from 'web3';
import UserLoginArtifact from '../contracts/UserLogin.json'; // Updated path

const contractAddress = "0x6517948Cc79bf87c619F4fB8202541E201e680a2"; // Replace with your actual contract address

const Login = ({ web3, setContract, setAccount, setIsLoggedIn, setUserRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

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
                    setUserRole(role.toLowerCase()); // Set the role for routing
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                alert('Login failed. Error: ' + error.message);
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleRegister = async () => {
        if (web3 && username && password && role) {
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(UserLoginArtifact.abi, contractAddress);
            setContract(contract);
            await contract.methods.register(username, password, role).send({ from: accounts[0] });
            alert('User registered successfully!');
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div>
            <h1>User Login</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
            />
            <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your role (patient, doctor, pharmacy)"
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Login;
