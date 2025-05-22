package com.example.demo.service;

import com.example.demo.dto.CustomerDto;
import java.util.List;
public interface CustomerService {
    CustomerDto save(CustomerDto customerDto);
    List<CustomerDto> findAll();
    String findNameById(int id);
    List<CustomerDto> findCustomerByManagerId(int managerId);
    boolean login(String email, String password);
    boolean register(String email, String password, String name);
    CustomerDto findCustomerByEmail(String email);
    CustomerDto findCustomerById(int patientId);
    CustomerDto update(CustomerDto customerDto);
    String findCustomerNameByPetId(int petId);
    String findCustomerImgUrlByPetId(int petId);
}
