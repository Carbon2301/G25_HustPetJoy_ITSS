package com.example.demo.repository;

import com.example.demo.model.Prescription;
import com.example.demo.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    Prescription findByTreatment(Treatment treatment);
}
