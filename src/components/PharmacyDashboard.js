import React, { useState } from 'react';
import { ethers } from 'ethers';
import UserLogin from "../contracts/UserLogin.json";

const PharmacyDashboard = () => {
    const [prescriptionId, setPrescriptionId] = useState('');
    const [prescription, setPrescription] = useState(null);
    const [error, setError] = useState(null);

    const contractAddress = "0x267b003DE19d953c3b3eA413CdF4852f86A9976f"; // Replace with your contract address

    const handleInputChange = (e) => {
        setPrescriptionId(e.target.value);
    };

    const fetchPrescription = async (e) => {
        e.preventDefault();
        if (!prescriptionId) {
            setError("Please enter a prescription ID.");
            return;
        }

        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                const fetchedPrescription = await contract.getPrescription(prescriptionId);
                console.log("Fetched Prescription:", fetchedPrescription);

                setPrescription({
                    doctor: fetchedPrescription.doctor,
                    patient: fetchedPrescription.patient,
                    diagnosis: fetchedPrescription.diagnosis,
                    medications: fetchedPrescription.medications,
                    date: fetchedPrescription.date,
                    patientName: fetchedPrescription.pname,
                    doctorName: fetchedPrescription.dname,
                });
                setError(null);
            }
        } catch (err) {
            console.error("Error fetching prescription:", err);
            setError("Failed to fetch the prescription. Please check the ID and try again.");
            setPrescription(null);
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            <h2 style={styles.heading}>Pharmacy Dashboard</h2>
            <form onSubmit={fetchPrescription} style={styles.form}>
                <input
                    type="text"
                    placeholder="Enter Prescription ID"
                    value={prescriptionId}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Fetch Prescription</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            {prescription ? (
                <div style={styles.prescriptionContainer}>
                    <h3 style={styles.subheading}>Prescription Details</h3>
                    <p><strong>Doctor:</strong> {prescription.doctor}</p>
                    <p><strong>Patient:</strong> {prescription.patient}</p>
                    <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                    <p><strong>Date:</strong> {`${prescription.date.toString().slice(0, 4)}-${prescription.date.toString().slice(4, 6)}-${prescription.date.toString().slice(6)}`}</p>
                    <p><strong>Patient Name:</strong> {prescription.patientName}</p>
                    <p><strong>Doctor Name:</strong> {prescription.doctorName}</p>
                    <h4 style={styles.medicationHeading}><strong>Medications:</strong></h4>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Name</th>
                                <th style={styles.tableHeader}>Dosage</th>
                                <th style={styles.tableHeader}>Frequency</th>
                                <th style={styles.tableHeader}>Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescription.medications.map((med, index) => (
                                <tr key={index} style={styles.tableRow}>
                                    <td style={styles.tableData}>{med.name}</td>
                                    <td style={styles.tableData}>{med.dosage}</td>
                                    <td style={styles.tableData}>{med.frequency}</td>
                                    <td style={styles.tableData}>{med.instructions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={styles.instructionText}>Please enter a valid prescription ID to view details.</p>
            )}
        </div>
    );
};

const styles = {
    dashboardContainer: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        fontSize: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        width: '80%',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: '10px',
    },
    prescriptionContainer: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
    },
    subheading: {
        fontSize: '20px',
        color: '#333',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '10px',
    },
    medicationHeading: {
        fontSize: '18px',
        color: '#333',
        marginTop: '15px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'left',
        border: '1px solid #ddd',
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
    },
    tableData: {
        padding: '8px',
        border: '1px solid #ddd',
    },
    instructionText: {
        textAlign: 'center',
        color: '#777',
        marginTop: '10px',
    },
};

export default PharmacyDashboard;
