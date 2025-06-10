package com.example.demo.service;

import com.example.demo.model.Medicine;
import com.example.demo.model.Prescription;
import com.example.demo.model.Treatment;
import com.example.demo.repository.MedicineRepository;
import com.example.demo.repository.PrescriptionRepository;
import com.example.demo.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;

    private final MedicineRepository medicineRepository;

    private final TreatmentRepository treatmentRepository;

//    public void savePrescription(int appointmentId, Medicine medicine) {
//        // Find treatment and throw exception if not found
//        Treatment treatment = treatmentRepository.findTreatmentByAppointmentid(appointmentId);
//        // Create and save prescription
//        Prescription prescription = new Prescription();
//        prescription.setTreatment(treatment);
//        prescription.setMedicines(Collections.singletonList(medicine));
//        prescription.setTotalPricePrescription(medicine.getPrice()); // Set total price if needed
//
//        try {
//            prescriptionRepository.save(prescription);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to save prescription: " + e.getMessage());
//        }
//    }

    public void savePrescription(int appointmentId, Medicine medicine) {
        // Find treatment and throw exception if not found
        Treatment treatment = treatmentRepository.findTreatmentByAppointmentid(appointmentId);
        if (treatment == null) {
            throw new RuntimeException("Treatment not found for appointment: " + appointmentId);
        }

        try {
            // Check if prescription already exists for this treatment
            Prescription existingPrescription = prescriptionRepository.findByTreatment(treatment);

            if (existingPrescription != null) {
                // Add new medicine to existing prescription
                List<Medicine> currentMedicines = existingPrescription.getMedicines();
                currentMedicines.add(medicine);
                existingPrescription.setMedicines(currentMedicines);

                // Update total price
                double currentTotal = existingPrescription.getTotalPricePrescription();
                existingPrescription.setTotalPricePrescription(currentTotal + medicine.getPrice());

                prescriptionRepository.save(existingPrescription);
            } else {
                // Create new prescription
                Prescription newPrescription = new Prescription();
                newPrescription.setTreatment(treatment);
                newPrescription.setMedicines(Collections.singletonList(medicine));
                newPrescription.setTotalPricePrescription(medicine.getPrice());

                prescriptionRepository.save(newPrescription);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to save prescription: " + e.getMessage());
        }
    }

    public List<Medicine> getPrescriptionByTreatmentId(int appointmentId){
        Treatment treatment = treatmentRepository.findTreatmentByAppointmentid(appointmentId);
        if (treatment == null) {
            throw new RuntimeException("Treatment not found for appointment: " + appointmentId);
        }
        List<Prescription> prescriptionsList = prescriptionRepository.findAll();
        List<Medicine> allMedicines = new ArrayList<>();
        for (Prescription prescription : prescriptionsList) {
            if(prescription.getTreatment().getId() == treatment.getId()){
                allMedicines.addAll(prescription.getMedicines());
            }
        }
        return allMedicines;
    }
}
