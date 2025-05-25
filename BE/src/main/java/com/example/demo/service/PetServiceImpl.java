package com.example.demo.service;

import com.example.demo.dto.PetDto;
import com.example.demo.model.Customer;
import com.example.demo.model.Pet;
import com.example.demo.model.Pet;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
    private final PetRepository petRepository;
    private final ModelMapper modelMapper;

    public PetDto save(PetDto petDto) {
        Pet pet = toEntity(petDto);
        pet = petRepository.save(pet);
        return toDto(pet);
    }

    private Pet toEntity(PetDto petDto) {
        Pet pet = modelMapper.map(petDto, Pet.class);
        return pet;
    }

    private PetDto toDto(Pet pet) {
        PetDto petDto = modelMapper.map(pet, PetDto.class);
        return petDto;
    }

    @Override
    public List<PetDto> findAll() {
        List<Pet> pets = petRepository.findAll();
        return pets.stream().map(this::toDto).toList();
    }

    @Override
    public String findNameById(int id) {
        Pet pet = petRepository.findById(id).orElse(null);
        return pet.getName();
    }

    @Override
    public String findImgUrlById(int id) {
        Pet pet = petRepository.findById(id).orElse(null);
        return pet.getImage();
    }

    @Override
    public List<PetDto> findPetByDoctorId(int managerId) {
        List<Pet> pets = petRepository.findPetByDoctorId(managerId);
        return pets.stream().map(this::toDto).toList();
    }

    @Override
    public List<PetDto> findPetByEmployeeId(int managerId) {
        List<Pet> pets = petRepository.findPetByEmployeeId(managerId);
        return pets.stream().map(this::toDto).toList();
    }

    @Override
    public List<PetDto> findPetByCustomerId(int customerId) {
        return petRepository.findPetByCustomer(customerId).stream().map(this::toDto).toList();
    }

    @Override
    public PetDto findPetById(int id) {
        Pet pet = petRepository.findById(id).orElse(null);
        return toDto(pet);
    }

}
