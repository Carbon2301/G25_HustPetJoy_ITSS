package com.example.demo.repository;

import com.example.demo.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    @Query(value = """
        SELECT * FROM rooms r
        WHERE r.id NOT IN (
            SELECT pr.room_id FROM pet_room pr
            WHERE (pr.time_in <= :endDate AND pr.time_out >= :startDate AND pr.is_available = 0)
        )
        """, nativeQuery = true)
    List<Room> findAvailableRooms(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO pet_room (room_id, pet_id, is_available, time_in, time_out) 
        VALUES (:roomId, :petId, :isAvailable, :startDate, :endDate)
        """, nativeQuery = true)
    void savePetRoom(
            @Param("roomId") int roomId,
            @Param("petId") int petId,
            @Param("isAvailable") int isAvailable,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query(value = """
        SELECT * FROM pet_room pr
        WHERE pr.pet_id = :petId
    """, nativeQuery = true)
    List<Room> findRoomByPet(@Param("petId") int petId);

    @Query(value = """
        SELECT 
            r.room_name AS roomName,
            r.image AS roomImage,
            pr.time_in AS startDate,
            pr.time_out AS endDate,
            r.total_price AS totalPrice,
            p.name AS petName,
            p.species AS petSpecies,
            p.image AS petImage,
            pr.pet_room_id AS petRoomId,
            pr.is_available AS isAvailable,
            p.id,
            pr.notes
        FROM pet_room pr
        JOIN rooms r ON pr.room_id = r.id
        JOIN pets p ON pr.pet_id = p.id
        WHERE pet_id = :petId
    """, nativeQuery = true)
    List<Object[]> findRoomBookingByCustomerId(@Param("petId") int petId);

    @Modifying
    @Query(value = """
    UPDATE pet_room 
    SET is_available = :isAvailable
    WHERE pet_room_id = :petRoomId
    """, nativeQuery = true)
    int updatePetRoomAvailability(
            @Param("petRoomId") int petRoomId,
            @Param("isAvailable") int isAvailable
    );

    @Modifying
    @Query(value = """
    UPDATE pet_room 
    SET notes = :notes
    WHERE pet_room_id = :petRoomId
    """, nativeQuery = true)
    int updatePetRoomNotes(
            @Param("petRoomId") int petRoomId,
            @Param("notes") String notes
    );

    @Query(value = """
        SELECT 
            r.room_name AS roomName,
            r.image AS roomImage,
            pr.time_in AS startDate,
            pr.time_out AS endDate,
            r.total_price AS totalPrice,
            p.name AS petName,
            p.species AS petSpecies,
            p.image AS petImage,
            pr.pet_room_id AS petRoomId,
            pr.is_available AS isAvailable,
            p.id,
            pr.notes
        FROM pet_room pr
        JOIN rooms r ON pr.room_id = r.id
        JOIN pets p ON pr.pet_id = p.id
    """, nativeQuery = true)
    List<Object[]> findRoomBooking();

}