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
    public List<CustomerDto> findCustomerByManagerId(int managerId) {
        List<Customer> customers = customerRepository.findCustomerByManagerId(managerId);
        return customers.stream().map(this::toDto).toList();
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

    @Override
    public boolean register(String email, String password, String name) {
        Customer customer = customerRepository.findByEmail(email);
        if(customer != null){
            return false;
        }
        Customer newCustomer = new Customer();
        newCustomer.setEmail(email);
        newCustomer.setPassword(password);
        newCustomer.setFullName(name);
        customerRepository.save(newCustomer);
        return true;
    }

    @Override
    public CustomerDto findCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email);
        return modelMapper.map(customer, CustomerDto.class);
    }

    @Override
    public CustomerDto findCustomerById(int managerId) {
        Optional<Customer> customerOptional = customerRepository.findById(managerId);
        return customerOptional.map(d -> modelMapper.map(d, CustomerDto.class)).orElse(null);
    }

    @Override
    public CustomerDto update(CustomerDto customerDto) {
        Optional<Customer> customerOptional = customerRepository.findById(customerDto.getId());
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.setFullName(customerDto.getFullName());
            customer.setImage(customerDto.getImage());
            customer.setEmail(customerDto.getEmail());
            customer.setDob(customerDto.getDob());
            customer.setAddress(customerDto.getAddress());
            customer.setPhone(customerDto.getPhone());
            customerRepository.save(customer);
            return modelMapper.map(customer, CustomerDto.class);
        }
        return null;
    }

}
