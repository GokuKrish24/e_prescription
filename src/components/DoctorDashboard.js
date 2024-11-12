import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorDashboard = () => {
    const [currentAppointments, setCurrentAppointments] = useState([]);
    const [account, setAccount] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState([]);
    const [diagnosis, setDiagnosis] = useState("");
    const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", instructions: "" }]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const contractAddress = "0x4B9345B3d2aD30be33152EC5b81E5fF2982A7C2d"; // Replace with your actual contract address

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setAccount(await signer.getAddress());
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const appointments = await contract.getDoctorCurrentAppointments();
                    setCurrentAppointments(appointments);
                } catch (error) {
                    console.error("Error fetching current appointments:", error);
                }
            }
        };

        const fetchpastAppointments = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const appointments = await contract.getDoctorPastAppointments();
                    console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                    setPastAppointments(appointments); // Update state with current appointments
                } catch (error) {
                    console.error("Error fetching past appointments:", error);
                }
            }
        };

        loadBlockchainData();
        fetchpastAppointments();
    }, []);

    const handlePrescribe = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleViewPrescription = async (patientAddr) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            const prescriptions = await contract.getPrescriptionsByPatient(patientAddr);
            setSelectedPrescription(prescriptions);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        }
    };

    const handleAddMedication = () => {
        setMedications([...medications, { name: "", dosage: "", frequency: "", instructions: "" }]);
    };

    const handleMedicationChange = (index, field, value) => {
        const newMedications = medications.slice();
        newMedications[index][field] = value;
        setMedications(newMedications);
    };


    const handleSubmitPrescription = async () => {
        if (!selectedAppointment) return;
    
        const { appointmentId: Ai, user: patientAddr, doctor: docAddr, doctorName: docName, patientName: patName, date: dateNow } = selectedAppointment;
    
        const formattedMedications = medications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            instructions: med.instructions,
        }));
    
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);
            const startTime = performance.now();
            // Submit the prescription
            const tx1 = await contract.addPrescription(patientAddr, diagnosis, formattedMedications, dateNow, patName, docName);
            await tx1.wait();
            const endTime = performance.now();
            alert("Prescription submitted successfully!");
            const transactionTime = endTime - startTime;
            console.log(`Transaction completed in ${transactionTime.toFixed(2)} milliseconds`);
            // Complete the appointment
            const tx2 = await contract.completeAppointment(patientAddr, docAddr, Ai); // Make sure the parameters are correct
            await tx2.wait();
            alert("Appointment completed successfully!");
    
            // Reset state after submission
            setDiagnosis("");
            setMedications([{ name: "", dosage: "", frequency: "", instructions: "" }]);
            setSelectedAppointment(null);
    
            // Refresh the page to load updated data
            window.location.reload();
        } catch (error) {
            console.error("Error submitting prescription:", error);
        }
    };
    
    const fetchPastAppointments = async () => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            try {
                const appointments = await contract.getDoctorPastAppointments();
                console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                setPastAppointments(appointments); // Update state with current appointments
            } catch (error) {
                console.error("Error fetching current appointments:", error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Doctor Dashboard</h1>
            <p className="text-muted">Logged in as: {account}</p>
            <h2 style={styles.subHeader}>Current Appointments</h2>
            {currentAppointments.length > 0 ? (
                <table style={styles.appointmentTable}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th>Patient Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Contact</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAppointments.map((appointment, index) => {
                            const [_,patientAddr, doctorAddr, doctorName, name, age, gender, contact, status, date, time] = appointment;

                            // Format date to YYYY-MM-DD
                            const formattedDate = `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date.toString().slice(6)}`;
                            
                            // Format time to HH:mm
                            const formattedTime = time.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');

                            return (
                                <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                    <td style={styles.cell}>{name}</td>
                                    <td style={styles.cell}>{age.toString()}</td>
                                    <td style={styles.cell}>{gender}</td>
                                    <td style={styles.cell}>{contact.toString()}</td>
                                    <td style={styles.cell}>{formattedDate}</td>
                                    <td style={styles.cell}>{formattedTime}</td>
                                    <td style={styles.statusCell}>{status}</td>
                                    <td style={styles.cell}>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => handlePrescribe(appointment)}
                                        >
                                            Prescribe
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleViewPrescription(patientAddr)}
                                        >
                                            View Prescription
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No current appointments found.</p>
            )}

            {selectedAppointment && (
                // Prescribe Modal
                <div className="modal show d-block" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Prescription</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedAppointment(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Diagnosis</label>
                                    <textarea
                                        className="form-control"
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        placeholder="Enter diagnosis"
                                    />
                                </div>
                                <h5 className="mt-4">Medications</h5>
                                {medications.map((med, index) => (
                                    <div key={index} className="border p-2 mt-2 rounded">
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Medicine Name"
                                            value={med.name}
                                            onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Dosage"
                                            value={med.dosage}
                                            onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Frequency"
                                            value={med.frequency}
                                            onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Instructions"
                                            value={med.instructions}
                                            onChange={(e) =>
                                                handleMedicationChange(index, "instructions", e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                                <button type="button" className="btn btn-secondary mt-3" onClick={handleAddMedication}>
                                    Add More
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setSelectedAppointment(null)}
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleSubmitPrescription}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Prescription Modal */}
            {selectedPrescription.length > 0 && (
                <div className="modal show d-block" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Prescription History</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedPrescription([])}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {selectedPrescription.map((prescription, index) => (
                                    <div key={index} className="mb-3 border p-2 rounded">
                                        <p><strong>Patient_Name:</strong> {prescription.patientName}</p>
                                        <p><strong>Doctor: Dr.</strong> {prescription.doctorName}</p>
                                        <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                        <p><strong>Date:</strong> {`${prescription.date.toString().slice(0, 4)}-${prescription.date.toString().slice(4, 6)}-${prescription.date.toString().slice(6)}`}</p>
                                        <h6><strong>Medications:</strong></h6>
                                        {prescription.medications.map((med, idx) => (
                                            <div key={idx} className="p-1">
                                                <p>Name: {med.name}</p>
                                                <p>Dosage: {med.dosage}</p>
                                                <p>Frequency: {med.frequency}</p>
                                                <p>Instructions: {med.instructions}</p>
                                                <hr />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setSelectedPrescription([])}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Past Appointments Table */}
            <h2 style={styles.subHeader}>Past Appointments</h2>
            {pastAppointments.length > 0 ? (
                <table style={styles.appointmentTable}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th>Patient Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastAppointments.map((appointment, index) => {
                            const [_,patientAddr, doctorAddr, doctorName, name, age, gender, contact, status, date, time] = appointment;
                            
                            // Format date to YYYY-MM-DD
                            const formattedDate = `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date.toString().slice(6)}`;
                            
                            // Format time to HH:mm
                            const formattedTime = time.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');

                            return (
                                <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                    <td style={styles.cell}>{name}</td>
                                    <td style={styles.cell}>{age.toString()}</td>
                                    <td style={styles.cell}>{gender}</td>
                                    <td style={styles.cell}>{formattedDate}</td>
                                    <td style={styles.cell}>{formattedTime}</td>
                                    <td style={styles.statusCellp}>Inactive</td>
                                    <td style={styles.cell}>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleViewPrescription(patientAddr)}
                                        >
                                            View Prescription
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No past appointments found.</p>
            )}
        </div>
    );
};


const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        color: '#007bff',
        fontSize: '2rem',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: '1.5rem',
        color: '#007bff',
        marginBottom: '10px',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ced4da',
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ced4da',
    },
    button: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    icon: {
        color: '#007bff',
        marginRight: '8px',
    },
    statusCellp: {
        padding: '12px 8px',
        textAlign: 'center',
        borderBottom: '1px solid #e0e0e0',
        color: 'red', // Success green for completed appointments
        fontWeight: 'bold',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    card: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    appointmentTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    tableHeader: {
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: '0.9rem',
        letterSpacing: '1px',
    },
    cell: {
        padding: '12px 8px',
        textAlign: 'center',
        borderBottom: '1px solid #e0e0e0',
    },
    statusCell: {
        padding: '12px 8px',
        textAlign: 'center',
        borderBottom: '1px solid #e0e0e0',
        color: '#28a745', // Success green for completed appointments
        fontWeight: 'bold',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#fff',
    }
};
export default DoctorDashboard;
