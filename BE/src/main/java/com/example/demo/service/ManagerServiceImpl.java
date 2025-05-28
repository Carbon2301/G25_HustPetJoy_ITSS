package com.example.demo.service;

import com.example.demo.config.UserAlreadyExistsException;
import com.example.demo.dto.ManagerDto;
import com.example.demo.model.Manager;
import com.example.demo.model.Role;
import com.example.demo.repository.ManagerRepository;
import com.example.demo.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    @Autowired
    private ManagerRepository managerRepository;
    @Autowired
    private RoleRepository roleRepository;

    private final ModelMapper modelMapper;

//    @Autowired
//    private PasswordEncoder passwordEncoder;


    @Override
    public ManagerDto saveDoctor(ManagerDto registrationDto) {
        if (managerRepository.findByEmail(registrationDto.getEmail()) != null) {
            throw new UserAlreadyExistsException("Manager with this email already exists.");
        }
        Role userRole = roleRepository.findByName("ROLE_DOCTOR");
        if (userRole == null) {
            userRole = new Role("ROLE_DOCTOR");
            userRole = roleRepository.save(userRole);
        }
//        String password = passwordEncoder.encode(registrationDto.getPassword());
//        registrationDto.setPassword(password);
        Manager user = new Manager(registrationDto.getImgUrl(),
                registrationDto.getName(),
                registrationDto.getEmail(),
                registrationDto.getPassword(),
                registrationDto.getFees(),
                registrationDto.getSpeciality(),
                registrationDto.getPosition(),
                registrationDto.getStatus(),
                registrationDto.getIsWorking(),
                registrationDto.getAbout(),
                Arrays.asList(userRole));
        Manager savedManager = managerRepository.save(user);
        return modelMapper.map(savedManager, ManagerDto.class);
    }

    @Override
    public ManagerDto saveEmployee(ManagerDto registrationDto) {
        if (managerRepository.findByEmail(registrationDto.getEmail()) != null) {
            throw new UserAlreadyExistsException("Manager with this email already exists.");
        }
        Role userRole = roleRepository.findByName("ROLE_EMPLOYEE");
        if (userRole == null) {
            userRole = new Role("ROLE_EMPLOYEE");
            userRole = roleRepository.save(userRole);
        }
//        String password = passwordEncoder.encode(registrationDto.getPassword());
//        registrationDto.setPassword(password);
        Manager user = new Manager(registrationDto.getImgUrl(),
                registrationDto.getName(),
                registrationDto.getEmail(),
                registrationDto.getPassword(),
                registrationDto.getFees(),
                registrationDto.getSpeciality(),
                registrationDto.getPosition(),
                registrationDto.getStatus(),
                registrationDto.getIsWorking(),
                registrationDto.getAbout(),
                Arrays.asList(userRole));
        Manager savedManager = managerRepository.save(user);
        return modelMapper.map(savedManager, ManagerDto.class);
    }

    @Override
    public boolean login(String email, String password) {
        Manager manager = managerRepository.findByEmail(email);
        if (manager != null && manager.getPassword().equals(password)) {
            return true;
        }
        return false;
    }

    @Override
    public boolean checkAdmin(String email) {
        List<String> roleNames = managerRepository.findRoleNamesByEmail(email);
        return roleNames.contains("ROLE_ADMIN");
    }

    @Override
    public boolean checkDoctor(String email) {
        List<String> roleNames = managerRepository.findRoleNamesByEmail(email);
        return roleNames.contains("ROLE_DOCTOR");
    }

    @Override
    public boolean checkEmployee(String email) {
        List<String> roleNames = managerRepository.findRoleNamesByEmail(email);
        return roleNames.contains("ROLE_EMPLOYEE");
    }


    @Override
    public List<Manager> findAll() {
        List<Manager> managers = managerRepository.findAll();
        return managers;
    }

    @Override
    public ManagerDto findManagerById(int managerId) {
        Optional<Manager> doctorOptional = managerRepository.findById(managerId);
        return doctorOptional.map(d -> modelMapper.map(d, ManagerDto.class)).orElse(null);
    }

    @Override
    public ManagerDto update(ManagerDto managerDto) {
        Optional<Manager> doctorOptional = managerRepository.findById(managerDto.getManagerId());
        if (doctorOptional.isPresent()) {
            Manager manager = doctorOptional.get();
            manager.setName(managerDto.getName());
            manager.setImgUrl(managerDto.getImgUrl());
            manager.setFees(managerDto.getFees());
            manager.setIsWorking(managerDto.getIsWorking());
            manager.setSpeciality(managerDto.getSpeciality());
            manager.setStatus(managerDto.getStatus());
            manager.setAbout(managerDto.getAbout());
            managerRepository.save(manager);
            return modelMapper.map(manager, ManagerDto.class);
        }
        return null;
    }

    @Override
    public ManagerDto findManagerByEmail(String email) {
        Manager manager = managerRepository.findByEmail(email);
        return modelMapper.map(manager, ManagerDto.class);
    }
}
