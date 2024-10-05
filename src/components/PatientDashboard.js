import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json"; // Ensure this path is correct

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [department, setDepartment] = useState("Neurology"); // Set default department
    const [selectedDoctor, setSelectedDoctor] = useState(""); // State to hold the selected doctor

    // Patient details
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientContact, setPatientContact] = useState("");

    // Predefined list of departments
    const departments = ["Neurology", "Dermatology", "Cardiology", "Orthopedic"];

    // Move contractAddress declaration here
    const contractAddress = "0x7e69a79ba39F9592Ca544DA42B38215E8cB30FcA"; // Replace with your actual contract address

    // Fetch doctors whenever the selected department changes
    useEffect(() => {
        const fetchDoctors = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const doctorList = await contract.getDoctorsByDepartment(department);
                    console.log("Doctor List:", doctorList); // Log the response to see the structure
                    setDoctors(doctorList); // Update the state with the fetched doctors
                } catch (error) {
                    console.error("Error fetching doctors:", error);
                }
            }
        };

        fetchDoctors();
    }, [department]);

    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value); // Update the selected department
        setSelectedDoctor(""); // Reset selected doctor when department changes
        // Reset patient details when changing department
        setPatientName("");
        setPatientAge("");
        setPatientGender("");
        setPatientContact("");
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value); // Update the selected doctor
    };

    const handleBooking = async () => {
        if (!selectedDoctor || !patientName || !patientAge || !patientGender || !patientContact) {
            alert("Please fill in all fields to book an appointment.");
            return;
        }

        const doctorAddress = doctors.find((doc) => doc.name === selectedDoctor).doctorAddress;

        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            try {
                const tx = await contract.bookAppointment(doctorAddress, patientName, patientAge, patientGender, patientContact);
                await tx.wait();
                alert("Appointment booked successfully!");
                // Resetting fields after booking
                setSelectedDoctor("");
                setPatientName("");
                setPatientAge("");
                setPatientGender("");
                setPatientContact("");
                setDoctors([]); // Clear doctors list
            } catch (error) {
                console.error("Error booking appointment:", error);
                alert("Error booking appointment. Please try again.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1>Book an Appointment</h1>
            <div className="mb-3">
                <label>Select Department:</label>
                <select className="form-select" value={department} onChange={handleDepartmentChange}>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h2>Doctors in {department}</h2>
                {doctors.length > 0 ? (
                    <ul className="list-group">
                        {doctors.map((doctor, index) => (
                            <li key={index} className="list-group-item">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="doctor" 
                                        value={doctor.name} 
                                        checked={selectedDoctor === doctor.name} 
                                        onChange={handleDoctorChange} 
                                    />
                                    <strong>Name:</strong> {doctor.name} <br />
                                    <strong>Department:</strong> {doctor.department} <br />
                                    <strong>Experience:</strong> {doctor.yearsOfExperience.toString()} years <br />
                                    <strong>Rating:</strong> {doctor.rating.toString()} <br />
                                </label>
                            </li>
                        ))} 
                    </ul>
                ) : (
                    <p>No doctors available in this department.</p>
                )}
            </div>
            {selectedDoctor && (
                <div className="mt-4">
                    <h2>Selected Doctor: {selectedDoctor}</h2>
                    <h3>Patient Details</h3>
                    <div className="mb-3">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={patientName} 
                            onChange={(e) => setPatientName(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Age:</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={patientAge} 
                            onChange={(e) => setPatientAge(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Gender:</label>
                        <select 
                            className="form-select" 
                            value={patientGender} 
                            onChange={(e) => setPatientGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Contact Number:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={patientContact} 
                            onChange={(e) => setPatientContact(e.target.value)} 
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleBooking}>
                        Book Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
