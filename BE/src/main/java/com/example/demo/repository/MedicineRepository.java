package com.example.demo.repository;

import com.example.demo.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {

    @Query("SELECT m FROM Medicine m " +
            "WHERE m.type = :type AND m.medicineName = :medicineName")
    Medicine findByTypeAndMedicineName(String medicineName, String type);
    Medicine save(Medicine medicine);
}
