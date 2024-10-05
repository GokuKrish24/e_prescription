import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json"; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [department, setDepartment] = useState("Neurology"); // Set default department
    const [selectedDoctor, setSelectedDoctor] = useState(""); // State to hold the selected doctor

    // Predefined list of departments
    const departments = ["Neurology", "Dermatology", "Cardiology", "Orthopedic"];

    // Fetch doctors whenever the selected department changes
    useEffect(() => {
        const fetchDoctors = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contractAddress = "0x7e69a79ba39F9592Ca544DA42B38215E8cB30FcA"; // Replace with your actual contract address
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
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value); // Update the selected doctor
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Book an Appointment</h1>
            <div className="form-group">
                <label htmlFor="departmentSelect">Select Department:</label>
                <select 
                    id="departmentSelect" 
                    className="form-control" 
                    value={department} 
                    onChange={handleDepartmentChange}
                >
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h2 className="mt-4">Doctors in {department}</h2>
                {doctors.length > 0 ? (
                    <ul className="list-group mt-3">
                        {doctors.map((doctor, index) => (
                            <li key={index} className="list-group-item">
                                <label className="form-check-label">
                                    <input 
                                        type="radio" 
                                        name="doctor" 
                                        value={doctor.name} 
                                        checked={selectedDoctor === doctor.name} 
                                        onChange={handleDoctorChange} 
                                        className="form-check-input" 
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
                    <p className="mt-3">No doctors available in this department.</p>
                )}
            </div>
            {selectedDoctor && (
                <div className="mt-4">
                    <h2>Selected Doctor: {selectedDoctor}</h2>
                    {/* Add a button to proceed with booking the appointment here */}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
