import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json"; // Ensure this path is correct

const DoctorDashboard = () => {
    const [currentAppointments, setCurrentAppointments] = useState([]);
    const [account, setAccount] = useState("");
    const contractAddress = "0xF9FBE6180B84715987d101de6D07128feC7b1d49"; // Replace with your actual contract address

    // Fetch current appointments when the component is mounted
    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setAccount(await signer.getAddress());
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const appointments = await contract.getDoctorCurrentAppointments();
                    console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                    setCurrentAppointments(appointments); // Update state with current appointments
                } catch (error) {
                    console.error("Error fetching current appointments:", error);
                }
            }
        };

        loadBlockchainData();
    }, []);

    return (
        <div className="container mt-4">
            <h1>Doctor Dashboard</h1>
            <p>Logged in as: {account}</p>
            <h2 className="mt-4">Current Appointments</h2>
            {currentAppointments.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Contact</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAppointments.map((appointment, index) => {
                            const [__, _, dname, name, age, gender,contact,status, date, time] = appointment; // Adjust based on the tuple structure
                            return (
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>{age.toString()}</td>
                                    <td>{gender}</td>
                                    <td>{contact.toString()}</td>
                                    <td>{date.toString()}</td>
                                    <td>{time.toString()}</td>
                                    <td>{status}</td>
                                    <td class="btn btn-primary">Prescribe</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No current appointments found.</p>
            )}
        </div>
    );
};

export default DoctorDashboard;
