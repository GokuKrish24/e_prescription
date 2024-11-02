// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AppointmentManagement.sol";

contract PrescriptionManagement is AppointmentManagement {
    struct Prescription {
        address doctor;           // Address of the doctor who prescribed
        address patient;          // Address of the patient
        string diagnosis;         // Diagnosis provided by the doctor
        Medication[] medications; // List of medications prescribed
    }

    struct Medication {
        string name;             // Name of the medication
        string dosage;           // Dosage of the medication
        string frequency;        // Frequency of the medication
        string instructions;     // Instructions for taking the medication
    }

    mapping(uint256 => Prescription) public prescriptions; // Mapping prescription ID to Prescription
    uint256 public prescriptionCount;                       // Counter for prescription IDs

    event PrescriptionAdded(uint256 indexed prescriptionId, address indexed doctor, address indexed patient);

    function addPrescription(
        address _patient,
        string memory _diagnosis,
        Medication[] memory _medications
    ) public {
        prescriptionCount++;

        Prescription storage newPrescription = prescriptions[prescriptionCount];
        newPrescription.doctor = msg.sender;
        newPrescription.patient = _patient;
        newPrescription.diagnosis = _diagnosis;

        // Manually copy medications from memory to storage
        for (uint256 i = 0; i < _medications.length; i++) {
            newPrescription.medications.push(Medication({
                name: _medications[i].name,
                dosage: _medications[i].dosage,
                frequency: _medications[i].frequency,
                instructions: _medications[i].instructions
            }));
        }

        emit PrescriptionAdded(prescriptionCount, msg.sender, _patient);
    }

    function getPrescription(uint256 _prescriptionId) public view returns (
        address doctor,
        address patient,
        string memory diagnosis,
        Medication[] memory medications
    ) {
        Prescription storage prescription = prescriptions[_prescriptionId];
        return (
            prescription.doctor,
            prescription.patient,
            prescription.diagnosis,
            prescription.medications
        );
    }
}
