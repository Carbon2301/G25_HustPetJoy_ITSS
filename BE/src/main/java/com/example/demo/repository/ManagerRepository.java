package com.example.demo.repository;

import com.example.demo.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Integer> {
    Manager findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean getRoleByEmail(String email);

    @Query("SELECT r.name FROM Manager m " +
            "JOIN m.roles r " +
            "WHERE m.email = :email")
    List<String> findRoleNamesByEmail(@Param("email") String email);
}
