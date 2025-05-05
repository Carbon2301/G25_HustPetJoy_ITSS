package com.example.demo.repository;

import com.example.demo.model.Customer;
import com.example.demo.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {
    @Query("""
        SELECT p
        FROM Pet p
        JOIN Treatment t ON p.id = t.pet.id
        JOIN Manager m ON m.id = t.manager.id
        WHERE m.id = :managerId
    """)
    List<Pet> findPetByDoctorId(int managerId);

    @Query("""
        SELECT p
        FROM Pet p
        JOIN Spa s ON p.id = s.pet.id
        JOIN Manager m ON m.id = s.manager.id
        WHERE m.id = :managerId
    """)
    List<Pet> findPetByEmployeeId(int managerId);

    @Query("""
        SELECT p
        FROM Pet p 
        WHERE p.customer.id = :customerId
    """)
    List<Pet> findPetByCustomer(int customerId);

    Pet getById(int id);
}