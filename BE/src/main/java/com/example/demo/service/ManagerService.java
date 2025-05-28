package com.example.demo.service;


import com.example.demo.dto.ManagerDto;
import com.example.demo.model.Manager;

import java.util.List;

public interface ManagerService {
    ManagerDto saveDoctor(ManagerDto doctor);
    ManagerDto saveEmployee(ManagerDto doctor);
    boolean login(String email, String password);

    boolean checkAdmin(String email);

    boolean checkDoctor(String email);

    boolean checkEmployee(String email);

    List<Manager> findAll();
    ManagerDto findManagerById(int doctor);
    ManagerDto update(ManagerDto doctor);
    ManagerDto findManagerByEmail(String email);
}
