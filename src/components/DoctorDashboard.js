import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorDashboard = () => {
    const [currentAppointments, setCurrentAppointments] = useState([]);
    const [account, setAccount] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [diagnosis, setDiagnosis] = useState("");
    const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", instructions: "" }]);
    const contractAddress = "0x094aC8F1765d2Ee27068A849C99aA457321f7130"; // Replace with your actual contract address

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setAccount(await signer.getAddress());
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const appointments = await contract.getDoctorCurrentAppointments();
                    console.log("Fetched Appointments:", appointments);
                    setCurrentAppointments(appointments);
                } catch (error) {
                    console.error("Error fetching current appointments:", error);
                }
            }
        };

        loadBlockchainData();
    }, []);

    const handlePrescribe = (appointment) => {
        setSelectedAppointment(appointment);
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
        // TODO: Add function to save prescription on the blockchain
        setDiagnosis("");
        setMedications([{ name: "", dosage: "", frequency: "", instructions: "" }]);
        setSelectedAppointment(null);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Doctor Dashboard</h1>
            <p className="text-muted">Logged in as: {account}</p>
            <h2 className="mt-4">Current Appointments</h2>
            {currentAppointments.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            {/* <th>Doctor</th> */}
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
                            const [__, _, ___, name, age, gender,contact, status, date, time] = appointment;

                            // Format date to YYYY-MM-DD
                            const formattedDate = `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date.toString().slice(6)}`;
                            
                            // Format time to HH:mm
                            const formattedTime = time.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');

                            return (
                                <tr key={index}>
                                    {/* <td>{dname}</td> */}
                                    <td>{name}</td>
                                    <td>{age.toString()}</td>
                                    <td>{gender}</td>
                                    <td>{contact.toString()}</td>
                                    <td>{formattedDate}</td>
                                    <td>{formattedTime}</td>
                                    <td>{status}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handlePrescribe(appointment)}
                                        >
                                            Prescribe
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
        </div>
    );
};

export default DoctorDashboard;

