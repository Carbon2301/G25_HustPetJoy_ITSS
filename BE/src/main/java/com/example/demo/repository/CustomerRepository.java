package com.example.demo.repository;

import com.example.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findByEmail(String email);

    @Query("""
        SELECT p
        FROM Customer p
        JOIN Treatment t ON p.id = t.pet.id
        JOIN Manager d ON d.id = t.manager.id
        WHERE d.id = :managerId
    """)
    List<Customer> findCustomerByManagerId(int managerId);

    @Query("""
        SELECT c
        FROM Customer c
        JOIN Pet p ON p.customer.id = c.id
    """)
    Customer findCustomerByPetId(int petId);
}
