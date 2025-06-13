package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.model.Appointment;
import com.example.demo.model.Customer;
import com.example.demo.model.Spa;
import com.example.demo.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.demo.config.GenToken.generateToken;
import static java.util.Collections.reverse;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/employee")
public class EmployeeController {
    private final ManagerService managerService;

    private final CustomerService customerService;
    private final AppointmentService appointmentService;
    private final SpaService spaService;
    private final PetService petService;
    private final RoomService roomService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginManager(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String password = request.get("password");
            if (!managerService.checkEmployee(email)) {
                response.put("success", false);
                response.put("message", "You are not Employee");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);  // Trả về 403 Forbidden
            }
            if (managerService.login(email, password) == true) {
                // Tạo token sử dụng hàm tự viết
                String token = generateToken(email, password);

                Map<String, Object> data = new HashMap<>();
                response.put("success", true);
                response.put("token", token);
                response.put("managerId", managerService.findManagerByEmail(email).getManagerId());

            } else {
                response.put("success", false);
                response.put("message", "Invalid credentials");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestHeader(value = "eToken", required = false) String eToken,
                                                            @RequestParam(value = "managerId", required = false) Integer managerId) {
        try {
            if (validateToken(eToken)) {
                Map<String, Object> response = new HashMap<>();
            }
            List<AppointmentDto> appointments = appointmentService.findAppointmentByEmployeeId(managerId);
            List<PetDto> pets = petService.findPetByEmployeeId(managerId);
            List<SpaDto> spas = spaService.findSpaByManagerId(managerId);
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> dashData = new HashMap<>();


            // Lấy danh sách fees
            List<Double> feesList = spas.stream()
                    .map(SpaDto::getFees) // Giữ nguyên kiểu Double
                    .collect(Collectors.toList());

            // Gán fees vào từng appointment
            for (int i = 0; i < appointments.size() && i < feesList.size(); i++) {
                AppointmentDto appointment = appointments.get(i);
                appointment.setFees(feesList.get(i)); // Gán fees trực tiếp dưới dạng Double
            }

            double totalFees = 0;
            // Tính tổng fees, chỉ tính khi IsPaid = 1 và không bị hủy
            for (int i = 0; i < appointments.size(); i++) {
                AppointmentDto appointment = appointments.get(i);
                if (appointment.getIsPaid() == true) {
                    totalFees += appointment.getFees();
                }
            }

            for (AppointmentDto appointment : appointments) {

                String petName = petService.findNameById(appointment.getPetId());
                appointment.setPetName(petName);

                String customerName = customerService.findCustomerNameByPetId(appointment.getPetId());
                appointment.setCustomerName(customerName);

                // Lấy ảnh customer từ petId của từng appointment
                String customerImgUrl = customerService.findCustomerImgUrlByPetId(appointment.getPetId());
                appointment.setCustomerImgUrl(customerImgUrl);
            }

            response.put("totalFees", totalFees);
            dashData.put("appointments", appointments.size());
//            dashData.put("customers", customers.size());
            dashData.put("pets", pets.size());
            dashData.put("latestAppointments", appointments);
            response.put("success", true);
            response.put("dashData", dashData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/cancel-appointment")
    public ResponseEntity<Map<String, Object>> cancelAppointment(@RequestHeader(value = "eToken", required = false) String eToken,
                                                                 @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(eToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            int appointmentId = (int) request.get("appointmentId");
            AppointmentDto appointment = appointmentService.findAppointmentById(appointmentId);

            appointment.setCancelled(true);
            appointmentService.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment cancelled successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/complete-appointment")
    public ResponseEntity<Map<String, Object>> completeAppointment(@RequestHeader(value = "eToken", required = false) String eToken,
                                                                   @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(eToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            int appointmentId = (int) request.get("appointmentId");
            AppointmentDto appointment = appointmentService.findAppointmentById(appointmentId);

            appointment.setIsCompleted(true);
            appointmentService.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment completed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointments(@RequestHeader(value = "eToken", required = false) String eToken,
                                                               @RequestParam(value = "managerId", required = false) Integer managerId) {
        try {
            if (!validateToken(eToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            List<AppointmentDto> appointments = appointmentService.findAppointmentByEmployeeId(managerId);
            List<SpaDto> spas = spaService.findSpaByManagerId(managerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            // Lấy danh sách fees
            List<String> feesList = spas.stream()
                    .map(spa -> String.valueOf(spa.getFees())) // Chuyển từ Double sang String
                    .collect(Collectors.toList());

            // Gán fees vào từng appointment
            for (int i = 0; i < appointments.size() && i < feesList.size(); i++) {
                AppointmentDto appointment = appointments.get(i);
                appointment.setFees(Double.parseDouble(feesList.get(i))); // Gán fees, chuyển từ String về Double nếu cần
            }

            // Lấy danh sách các cuộc hẹn từ database
            for (AppointmentDto appointment : appointments) {
                String petImgUrl = petService.findImgUrlById(appointment.getPetId());
                appointment.setPetImgUrl(petImgUrl);

                String petName = petService.findNameById(appointment.getPetId());
                appointment.setPetName(petName);

                String customerName = customerService.findCustomerNameByPetId(appointment.getPetId());
                appointment.setCustomerName(customerName);

                // Lấy ảnh customer từ petId của từng appointment
                String customerImgUrl = customerService.findCustomerImgUrlByPetId(appointment.getPetId());
                appointment.setCustomerImgUrl(customerImgUrl);
            }

            // Đưa danh sách appointments vào response
            response.put("appointments", appointments);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getDoctorProfile(@RequestHeader(value = "eToken", required = false) String eToken,
                                                                @RequestParam(value = "managerId", required = false) Integer managerId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate the token


            // Fetch profile using service
            ManagerDto profileData = managerService.findManagerById(managerId);

            if (profileData != null) {
                response.put("success", true);
                response.put("profileData", profileData);
            } else {
                response.put("success", false);
                response.put("message", "Profile not found");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateDoctorProfile(
            @RequestHeader(value = "eToken", required = false) String eToken,
            @RequestBody Map<String, Object> updateData) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra tính hợp lệ của token
            if (eToken == null || eToken.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            // Lấy dữ liệu từ request
            int managerId;
            try {
                managerId = Integer.parseInt(updateData.get("managerId").toString());
            } catch (NumberFormatException e) {
                response.put("success", false);
                response.put("message", "'managerId' must be a valid integer");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            int isWorking = Integer.parseInt(updateData.get("available").toString());
            String about = (String) updateData.get("about");
            String fees = (String) updateData.get("fees");

            // Tìm và cập nhật thông tin bác sĩ
            ManagerDto doctor = managerService.findManagerById(managerId);
            if (doctor != null) {
                doctor.setIsWorking(isWorking);
                doctor.setAbout(about);
                doctor.setFees(fees);

                managerService.update(doctor);

                response.put("success", true);
                response.put("message", "Profile updated successfully.");
            } else {
                response.put("success", false);
                response.put("message", "Manager not found.");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pet")
    public ResponseEntity<Map<String, Object>> cancelRoomBookings(@RequestHeader(value = "eToken", required = false) String token,
                                                                  @RequestParam int id) {
        Map<String, Object> response = new HashMap<>();
        try{
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
            }

            PetDto pet = petService.findPetById(id);
            response.put("pet", pet);
            response.put("success", true);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getRooms(@RequestHeader(value = "eToken", required = false) String eToken) {
        Map<String, Object> response = new HashMap<>();
        try{
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (eToken == null || !validateToken(eToken)) {
                response.put("success", false);
                response.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Lấy danh sách các phòng từ database
            List<RoomDto> rooms = roomService.getAllRooms();

            response.put("success", true);
            response.put("rooms", rooms);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred while fetching rooms: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/room-bookings")
    public ResponseEntity<Map<String, Object>> getRoomBookings(@RequestHeader(value = "eToken", required = false) String eToken) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (eToken == null || !validateToken(eToken)) {
                response.put("success", false);
                response.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            List<Map<String, Object>> roomBookings = roomService.findAllPetRooms(); // 0 là id của pet

            response.put("success", true);
            response.put("roomBookings", roomBookings);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred while fetching room bookings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/notes-room")
    public ResponseEntity<Map<String, Object>> noteRoom(@RequestHeader(value = "eToken", required = false) String eToken,
                                                        @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(eToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            int petRoomId = (int) request.get("petRoomId");

            String notes = request.get("notes").toString();
            roomService.saveNotes(petRoomId, notes);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notes completed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public boolean validateToken(String token){
        return true;
    }
}
