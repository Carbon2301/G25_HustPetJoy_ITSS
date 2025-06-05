package com.example.demo.service;

import com.example.demo.dto.CustomerDto;
import com.example.demo.model.Customer;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private final ModelMapper modelMapper;

    @Override
    public CustomerDto save(CustomerDto customerDto) {
        Customer customer = toEntity(customerDto);
        customer = customerRepository.save(customer);
        return toDto(customer);
    }


    private Customer toEntity(CustomerDto customerDto) {
        Customer customer = modelMapper.map(customerDto, Customer.class);
        return customer;
    }

    private CustomerDto toDto(Customer customer) {
        CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);
        return customerDto;
    }

    @Override
    public List<CustomerDto> findAll() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream().map(this::toDto).toList();
    }

    @Override
    public String findNameById(int id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        return customer.getFullName();
    }

    @Override
    public String findCustomerNameByPetId(int petId) {
        Customer customer = customerRepository.findCustomerByPetId(petId);
        return customer.getFullName();
    }

    @Override
    public String findCustomerImgUrlByPetId(int petId) {
        Customer customer = customerRepository.findCustomerByPetId(petId);
        return customer.getImage();
    }


    @Override
    public boolean login(String email, String password) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer != null && customer.getPassword().equals(password)) {
            return true;
        }
        return false;
    }

}
