import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json";
import { FaUserMd, FaClinicMedical, FaCalendarCheck } from "react-icons/fa";

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [department, setDepartment] = useState("Neurology"); // Set default department
    const [selectedDoctor, setSelectedDoctor] = useState(""); // State to hold the selected doctor

    // Patient details
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientContact, setPatientContact] = useState("");
    const [patientAppointmentDate, setPatientAppointmentDate] = useState("");
    const [patientAppointmentTime, setPatientAppointmentTime] = useState("");

    // Predefined list of departments
    const departments = ["Neurology", "Dermatology", "Cardiology", "Orthopedic"];
    
    // Current appointments state
    const [currentAppointments, setCurrentAppointments] = useState([]);

    const contractAddress = "0xb3FcB508Eb58D82EF8799d8FA7D64bb80127b2A8"; // Replace with your actual contract address

    // Fetch doctors and current appointments whenever the selected department changes
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

        const fetchCurrentAppointments = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const appointments = await contract.getUserCurrentAppointments();
                    console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                    setCurrentAppointments(appointments); // Update state with current appointments
                } catch (error) {
                    console.error("Error fetching current appointments:", error);
                }
            }
        };

        fetchDoctors();
        fetchCurrentAppointments();
    }, [department]);

    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value); // Update the selected department
        setSelectedDoctor(""); // Reset selected doctor when department changes
        // Reset patient details when changing department
        setPatientName("");
        setPatientAge("");
        setPatientGender("");
        setPatientContact("");
        setPatientAppointmentDate("");
        setPatientAppointmentTime("");
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value); // Update the selected doctor
    };

    const handleBooking = async () => {
        if (!selectedDoctor || !patientName || !patientAge || !patientGender || !patientContact || !patientAppointmentDate || !patientAppointmentTime) {
            alert("Please fill in all fields to book an appointment.");
            return;
        }
    
        // Remove hyphens from date and convert it to an integer format
        const formattedDate = parseInt(patientAppointmentDate.replace(/-/g, ""));
    
        // Remove colon from time and convert it to an integer format
        const formattedTime = parseInt(patientAppointmentTime.replace(":", ""));
    
        const doctorAddress = doctors.find((doc) => doc.name === selectedDoctor).doctorAddress;
    
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);
    
            try {
                const tx = await contract.bookAppointment(
                    doctorAddress,
                    patientName,
                    patientAge,
                    patientGender,
                    patientContact,
                    formattedDate, // Pass the formatted date here
                    formattedTime  // Pass the formatted time here
                );
                await tx.wait();
                alert("Appointment booked successfully!");
                // Resetting fields after booking
                setSelectedDoctor("");
                setPatientName("");
                setPatientAge("");
                setPatientGender("");
                setPatientContact("");
                setPatientAppointmentDate("");
                setPatientAppointmentTime("");
                // Refresh current appointments
                fetchCurrentAppointments(); // Refresh current appointments after booking
            } catch (error) {
                console.error("Error booking appointment:", error);
                alert("Error booking appointment. Please try again.");
            }
        }
    };
    
    

    // Function to fetch current appointments
    const fetchCurrentAppointments = async () => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            try {
                const appointments = await contract.getUserCurrentAppointments();
                console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                setCurrentAppointments(appointments); // Update state with current appointments
            } catch (error) {
                console.error("Error fetching current appointments:", error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Book an Appointment</h1>

            {/* Department Selection */}
            <div style={styles.inputGroup}>
                <label>Select Department:</label>
                <select style={styles.select} value={department} onChange={handleDepartmentChange}>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {/* Doctors List */}
            <div>
                <h2 style={styles.subHeader}>Doctors in {department}</h2>
                {doctors.length > 0 ? (
                    <ul style={styles.list}>
                        {doctors.map((doctor, index) => (
                            <li key={index} style={styles.listItem}>
                                <label>
                                    <input
                                        type="radio"
                                        name="doctor"
                                        value={doctor.name}
                                        checked={selectedDoctor === doctor.name}
                                        onChange={handleDoctorChange}
                                    />
                                    <FaUserMd style={styles.icon} /> Dr. {doctor.name} - {doctor.department}
                                    <br />
                                    Experience: {doctor.yearsOfExperience.toString()} years <br />
                                    Rating: {doctor.rating.toString()}
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No doctors available in this department.</p>
                )}
            </div>

            {/* Patient Details Form */}
            {selectedDoctor && (
                <div style={styles.card}>
                    <h3 style={styles.subHeader}>Patient Details</h3>
                    <div style={styles.inputGroup}>
                        <label>Name:</label>
                        <input
                            type="text"
                            style={styles.input}
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Age:</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Gender:</label>
                        <select
                            style={styles.select}
                            value={patientGender}
                            onChange={(e) => setPatientGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Contact Number:</label>
                        <input
                            type="text"
                            style={styles.input}
                            value={patientContact}
                            onChange={(e) => setPatientContact(e.target.value)}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Date of Appointment:</label>
                        <input
                            id="date" 
                            type="date" // Changed to use a calendar picker
                            style={styles.input}
                            value={patientAppointmentDate}
                            onChange={(e) => setPatientAppointmentDate(e.target.value)}
                        />

                    </div>
                    <div style={styles.inputGroup}>
                        <label>Time of Appointment:</label>
                        <input
                            type="time" 
                            id="time"
                            style={styles.input}
                            value={patientAppointmentTime}
                            onChange={(e) => setPatientAppointmentTime(e.target.value)}
                        />
                    </div>
                    <button style={styles.button} onClick={handleBooking}>
                        <FaCalendarCheck /> Book Appointment
                    </button>
                </div>
            )}

            {/* Current Appointments Table */}
            <h2 style={styles.subHeader}>Current Appointments</h2>
            {currentAppointments.length > 0 ? (
                <table style={styles.appointmentTable}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th>Doctor</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAppointments.map((appointment, index) => {
                            const [__, _, dname, name, age, gender, ___, status, date, time] = appointment;
                            
                            // Format date to YYYY-MM-DD
                            const formattedDate = `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date.toString().slice(6)}`;
                            
                            // Format time to HH:mm
                            const formattedTime = time.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');

                            return (
                                <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                    <td style={styles.cell}>{dname}</td>
                                    <td style={styles.cell}>{name}</td>
                                    <td style={styles.cell}>{age.toString()}</td>
                                    <td style={styles.cell}>{gender}</td>
                                    <td style={styles.cell}>{formattedDate}</td>
                                    <td style={styles.cell}>{formattedTime}</td>
                                    <td style={styles.statusCell}>{status}</td>
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

export default PatientDashboard;