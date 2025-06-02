package com.example.demo.service;

import com.example.demo.dto.RoomDto;
import com.example.demo.model.Pet;
import com.example.demo.model.Room;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;
    private final PetRepository petRepository;

    @Override
    public List<RoomDto> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto findRoomById(Integer id) {
        return roomRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    public List<RoomDto> getAvailableRooms(Date startDate, Date endDate) {
        List<Room> rooms = roomRepository.findAvailableRooms(startDate, endDate);
        return rooms.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void savePetRoom(int roomId, int petId, int isAvailable, Date startDate, Date endDate) {
        roomRepository.savePetRoom(roomId, petId, isAvailable, startDate, endDate);
    }

    @Override
    public List<Map<String, Object>> findRoomBookingByCustomerId(int customerId) {
        List<Pet> pets = petRepository.findPetByCustomer(customerId);
        List<Map<String, Object>> roomBookings = new ArrayList<>();
        for (Pet pet : pets) {
            List<Object[]> results = roomRepository.findRoomBookingByCustomerId(pet.getId());
            List<Map<String, Object>> bookings = new ArrayList<>();
            for (Object[] row : results) {
                Map<String, Object> booking = new HashMap<>();
                booking.put("roomName", row[0]);
                booking.put("roomImage", row[1]);
                booking.put("startDate", row[2]);
                booking.put("endDate", row[3]);
                booking.put("totalPrice", row[4]);
                booking.put("petName", row[5]);
                booking.put("petSpecies", row[6]);
                booking.put("petImage", row[7]);
                booking.put("petRoomId", row[8]);
                booking.put("isAvailable", row[9]);
                booking.put("petId", row[10]);
                booking.put("notes", row[11]);
                bookings.add(booking);
            }
            roomBookings.addAll(bookings);
        }
        return roomBookings;
    }

    @Override
    @Transactional
    public void deletePetRoom(int petRoomId) {
        roomRepository.updatePetRoomAvailability(petRoomId, 1); // Assuming 1 means available
    }

    @Override
    @Transactional
    public void saveNotes(int petRoomId, String notes) {
        roomRepository.updatePetRoomNotes(petRoomId, notes); // Assuming 1 means available
    }

    @Override
    public List<Map<String, Object>> findAllPetRooms() {
        List<Map<String, Object>> roomBookings = new ArrayList<>();
        List<Object[]> results = roomRepository.findRoomBooking();
            List<Map<String, Object>> bookings = new ArrayList<>();
            for (Object[] row : results) {
                Map<String, Object> booking = new HashMap<>();
                booking.put("roomName", row[0]);
                booking.put("roomImage", row[1]);
                booking.put("startDate", row[2]);
                booking.put("endDate", row[3]);
                booking.put("totalPrice", row[4]);
                booking.put("petName", row[5]);
                booking.put("petSpecies", row[6]);
                booking.put("petImage", row[7]);
                booking.put("petRoomId", row[8]);
                booking.put("isAvailable", row[9]);
                booking.put("petId", row[10]);
                booking.put("notes", row[11]);
                bookings.add(booking);
            }
            roomBookings.addAll(bookings);
        return roomBookings;
    }

    private RoomDto toDto(Room room) {
        RoomDto roomDto = modelMapper.map(room, RoomDto.class);
        return roomDto;
    }

    private Room toEntity(RoomDto roomDto) {
        Room room = modelMapper.map(roomDto, Room.class);
        return room;
    }
}
