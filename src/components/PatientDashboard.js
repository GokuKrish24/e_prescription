import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserLogin from "../contracts/UserLogin.json";
import { FaUserMd, FaClinicMedical, FaCalendarCheck } from "react-icons/fa";

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [department, setDepartment] = useState("Neurology"); // Set default department
    const [selectedDoctor, setSelectedDoctor] = useState(""); // State to hold the selected doctor
    const [doctorReviews, setDoctorReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);

    // Patient details
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientContact, setPatientContact] = useState("");
    const [patientAppointmentDate, setPatientAppointmentDate] = useState("");
    const [patientAppointmentTime, setPatientAppointmentTime] = useState("");
    const [prescriptions, setPrescriptions] = useState([]);
    const [showPrescriptions, setShowPrescriptions] = useState(false);

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [doctorAddress, setDoctorAddress] = useState("");
    // Predefined list of departments
    const departments = ["Neurology", "Dermatology", "Cardiology", "Orthopedic"];
    
    // Current appointments state
    const [currentAppointments, setCurrentAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);

    const contractAddress = "0x4B9345B3d2aD30be33152EC5b81E5fF2982A7C2d"; // Replace with your actual contract address

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

        const fetchpastAppointments = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

                try {
                    const appointments = await contract.getUserPastAppointments();
                    console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                    setPastAppointments(appointments); // Update state with current appointments
                } catch (error) {
                    console.error("Error fetching past appointments:", error);
                }
            }
        };

        fetchDoctors();
        fetchCurrentAppointments();
        fetchpastAppointments();
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

    const handleSeeReviewsClick = async (doctorAddress) => {
        try {
            // Ensure MetaMask is connected
            if (typeof window.ethereum === "undefined") {
                alert("Please install MetaMask to use this feature.");
                return;
            }
    
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);
    
            // Fetch reviews from the smart contract
            const reviews = await contract.getDoctorReviews(doctorAddress);
            setDoctorReviews(reviews);
            setShowReviews(true);  // Show reviews modal
        } catch (error) {
            console.error("Error fetching reviews:", error);
            alert("Error fetching reviews. Please try again.");
        }
    };

    const handleViewPrescriptions = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            const prescriptionsData = await contract.getPrescriptionsByPatient(signer.getAddress()); // Fetch prescriptions for the patient
            setPrescriptions(prescriptionsData);
            setShowPrescriptions(true); // Show the modal with prescriptions
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        }
    };

    const handleReviewClick = (doctor) => {
        setDoctorAddress(doctor);  // Set the doctor's address (did)
        setShowReviewForm(true);    // Show the review form modal
    };

    const handleReviewSubmission = async () => {
        if (!reviewRating || !reviewComment) {
            alert("Please provide both rating and comment for the review.");
            return;
        }

        try {
            // Ensure MetaMask is connected
            if (typeof window.ethereum === "undefined") {
                alert("Please install MetaMask to use this feature.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            // Submit the review to the smart contract
            const tx = await contract.submitReview(doctorAddress, reviewRating, reviewComment);

            await tx.wait();  // Wait for the transaction to be mined
            alert("Review submitted successfully!");

            // Reset review form and close modal
            setReviewRating(0);
            setReviewComment("");
            setShowReviewForm(false);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review. Please try again.");
        }
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
                const startTime = performance.now();  // Start time
    
                const tx = await contract.bookAppointment(
                    doctorAddress,
                    patientName,
                    patientAge,
                    patientGender,
                    patientContact,
                    formattedDate, // Pass the formatted date here
                    formattedTime  // Pass the formatted time here
                );
    
                await tx.wait();  // Wait for the transaction to be mined
                const endTime = performance.now();  // End time
    
                const transactionTime = endTime - startTime;  // Calculate transaction time
    
                console.log(`Transaction completed in ${transactionTime.toFixed(2)} milliseconds`);
    
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
                fetchPastAppointments();
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

    // Function to fetch current appointments
    const fetchPastAppointments = async () => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, UserLogin.abi, signer);

            try {
                const appointments = await contract.getUserPastAppointments();
                console.log("Fetched Appointments:", appointments); // Log the fetched appointments
                setPastAppointments(appointments); // Update state with current appointments
            } catch (error) {
                console.error("Error fetching current appointments:", error);
            }
        }
    };


    return (
        <div style={styles.container}>
            <button className="btn btn-info" onClick={handleViewPrescriptions}>
                View Prescriptions
            </button>

            {/* View Prescription Modal */}
            {showPrescriptions && (
                <div className="modal show d-block" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Prescription History</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowPrescriptions(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {prescriptions.length > 0 ? (
                                    prescriptions.map((prescription, index) => (
                                        <div key={index} className="mb-3 border p-2 rounded">
                                            <p><strong>Doctor:</strong> Dr. {prescription.doctorName}</p>
                                            <p><strong>Patient:</strong>{prescription.patientName}</p>                                            
                                            <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                            <p><strong>Date:</strong> {`${prescription.date.toString().slice(0, 4)}-${prescription.date.toString().slice(4, 6)}-${prescription.date.toString().slice(6)}`}</p>
                                            <h6>Medications:</h6>
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
                                    ))
                                ) : (
                                    <p>No prescriptions found.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setShowPrescriptions(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
                                {/* Add "See Reviews" Button */}
                                <button
                                    className="btn btn-info"
                                    onClick={() => handleSeeReviewsClick(doctor.doctorAddress)}
                                >
                                    See Reviews
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No doctors available in this department.</p>
                )}

                {/* Display Reviews Modal */}
                {showReviews && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="reviewsModal" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="reviewsModal">Reviews{selectedDoctor}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowReviews(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {doctorReviews.length > 0 ? (
                                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                        {doctorReviews.map((review, index) => (
                                            <li key={index} style={{ marginBottom: '15px' }}>
                                                <strong 
                                                    style={{ 
                                                        textDecoration: 'underline', 
                                                        backgroundColor: '#ffff99', // Light yellow highlight
                                                        padding: '2px'
                                                    }}
                                                >
                                                    Patient {index + 1}
                                                </strong><br />
                                                <strong>Rating:</strong> {review.rating.toString()} <br />
                                                <strong>Comment:</strong> {review.comment} <br />
                                            </li>
                                        ))}
                                    </ul>
                                    ) : (
                                        <p>No reviews available for this doctor.</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowReviews(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            const [AI,__, _, dname, name, age, gender, ___, status, date, time] = appointment;
                            
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

            
            {/* Past Appointments Table */}
            <h2 style={styles.subHeader}>Past Appointments</h2>
            {pastAppointments.length > 0 ? (
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
                            <th>Review</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastAppointments.map((appointment, index) => {
                            const [AI,uid, did, dname, name, age, gender, ___, status, date, time] = appointment;
                            
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
                                    <td style={styles.statusCellp}>{status}</td>
                                    <td style={styles.cell}>
                                        <button
                                            className="btn btn-success"
                                            style={styles.reviewButton}
                                            onClick={() => handleReviewClick(did)}  // Pass the doctor address (did)
                                        >
                                            Give Review
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

            {/* Review Form Modal */}
{showReviewForm && (
    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="reviewFormModal" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="reviewFormModal">Submit a Review</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowReviewForm(false)}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Rating (1-5):</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            id="rating"
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="comment" className="form-label">Comment:</label>
                        <textarea
                            id="comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="form-control"
                            rows="4"
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        onClick={handleReviewSubmission}
                        className="btn btn-primary"
                    >
                        Submit Review
                    </button>
                    <button
                        onClick={() => setShowReviewForm(false)}
                        className="btn btn-secondary"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
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

export default PatientDashboard;