package com.example.demo.service;

import com.example.demo.dto.RoomDto;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface RoomService {
    List<RoomDto> getAllRooms();
    RoomDto findRoomById(Integer id);
    List<RoomDto> getAvailableRooms(Date startDate, Date endDate);
    void savePetRoom(int roomId, int petId, int isAvailable, Date startDate, Date endDate);
    List<Map<String, Object>> findRoomBookingByCustomerId(int petId);
    void deletePetRoom(int petRoomId);
    public List<Map<String, Object>> findAllPetRooms();
    void saveNotes(int petRoomId, String notes);
}
