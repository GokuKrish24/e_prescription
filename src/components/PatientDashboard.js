// src/components/PatientDashboard.js
import React from 'react';

const PatientDashboard = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h2>My Appointments</h2>
                        </div>
                        <div className="card-body">
                            <p>View your upcoming appointments here.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h2>My Prescriptions</h2>
                        </div>
                        <div className="card-body">
                            <p>View all your prescriptions here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
