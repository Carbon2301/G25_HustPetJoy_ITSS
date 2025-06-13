
package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.model.Appointment;
import com.example.demo.model.Manager;
import com.example.demo.model.Pet;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.ManagerRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static com.example.demo.config.GenToken.generateToken;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/admin")
public class AdminController {

    private final ManagerService managerService;

    private final S3Service S3Service;

    private final CustomerService customerService;

    private final PetService petService;

    private final AppointmentService appointmentService;
    private final ManagerRepository managerRepository;

    private final RoomService roomService;

    @PostMapping("/add-doctor")
    @Operation(summary = "Luu 1 doctor vao phong kham")
    public ResponseEntity<?> saveDoctor(@RequestPart("image") MultipartFile imageFile,
                                  @RequestPart("name") String name,
                                  @RequestPart("email") String email,
                                  @RequestPart("password") String password,
                                  @RequestPart("fees") String fees,
                                  @RequestPart("speciality") String speciality,
                                  @RequestPart("about") String about) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (imageFile == null || imageFile.isEmpty()) {
                response.put("success", false);
                response.put("message", "Image file is required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            String imageUrl = S3Service.uploadFile(imageFile);
            ManagerDto managerDto = ManagerDto.builder()
                    .name(name)
                    .email(email)
                    .password(password)
                    .fees(fees)
                    .speciality(speciality)
                    .imgUrl(imageUrl)
                    .status(1)
                    .isWorking(1)
                    .position("Doctor")
                    .about(about)
                    .build();
            managerService.saveDoctor(managerDto);
            response.put("success", true);
            response.put("message", "Doctor added successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred while processing the request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/add-employee")
    @Operation(summary = "Luu 1 employee vao phong kham")
    public ResponseEntity<?> saveEmployee(@RequestPart("image") MultipartFile imageFile,
                                  @RequestPart("name") String name,
                                  @RequestPart("email") String email,
                                  @RequestPart("password") String password,
                                  @RequestPart("fees") String fees,
                                  @RequestPart("speciality") String speciality,
                                  @RequestPart("about") String about) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (imageFile == null || imageFile.isEmpty()) {
                response.put("success", false);
                response.put("message", "Image file is required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            String imageUrl = S3Service.uploadFile(imageFile);
            ManagerDto managerDto = ManagerDto.builder()
                    .name(name)
                    .email(email)
                    .password(password)
                    .fees(fees)
                    .speciality(speciality)
                    .imgUrl(imageUrl)
                    .status(1)
                    .isWorking(1)
                    .position("Employee")
                    .about(about)
                    .build();
            managerService.saveEmployee(managerDto);
            response.put("success", true);
            response.put("message", "Employee added successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred while processing the request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String password = request.get("password");
            // Kiểm tra role của người dùng
            if (!managerService.checkAdmin(email)) {
                response.put("success", false);
                response.put("message", "You are not an Admin");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);  // Trả về 403 Forbidden
            }
            if (managerService.login(email, password) == true) {
                // Tạo token sử dụng hàm tự viết
                String token = generateToken(email, password);

                response.put("success", true);
                response.put("token", token);
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
    public ResponseEntity<Map<String, Object>> getAdminDashboard(@RequestHeader(value = "aToken", required = false) String aToken) {
        try {
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (aToken == null || !validateToken(aToken)) {
                Map<String, Object> unauthorizedResponse = new HashMap<>();
                unauthorizedResponse.put("success", false);
                unauthorizedResponse.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(unauthorizedResponse);
            }

            // Lấy danh sách các đối tượng từ database
            List<Manager> managers = managerService.findAll();
            List<CustomerDto> customers = customerService.findAll();
            List<Appointment> appointments = appointmentService.findAll();
            List<PetDto> pets = petService.findAll();
            List<AppointmentDto> appointmentDtos = appointmentService.findAppointmentsWithManagers();

            // Đảo ngược danh sách các cuộc hẹn để lấy các cuộc hẹn mới nhất
            Collections.reverse(appointments);

            // Tạo đối tượng để trả về
            Map<String, Object> dashData = new HashMap<>();
            dashData.put("doctors", managers.size());
            dashData.put("appointments", appointments.size());
            dashData.put("customers", customers.size());
            dashData.put("pets", pets.size());
            dashData.put("latestAppointments", appointmentDtos);
            // Tạo response JSON
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("dashData", dashData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Phương thức mẫu để kiểm tra token (cần được cài đặt cụ thể hơn)
    private boolean validateToken(String token) {
        // Thêm logic để xác thực token tại đây
        return true; // Trả về true nếu hợp lệ, false nếu không
    }

    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointments(@RequestHeader(value = "aToken", required = false) String aToken) {
        try {
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (aToken == null || !validateToken(aToken)) {
                Map<String, Object> unauthorizedResponse = new HashMap<>();
                unauthorizedResponse.put("success", false);
                unauthorizedResponse.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(unauthorizedResponse);
            }

            // Lấy danh sách các cuộc hẹn từ database
            List<AppointmentDto> appointments = appointmentService.findAppointmentsWithManagers();
            for (AppointmentDto appointment : appointments) {
                ManagerDto doctor = appointmentService.findManagerByAppointmentId(appointment.getAppointmentId());
                appointment.setManager(doctor);

                String petName = petService.findNameById(appointment.getPetId());
                appointment.setPetName(petName);

                String customerName = customerService.findCustomerNameByPetId(appointment.getPetId());
                appointment.setCustomerName(customerName);

                appointment.setFees(100);
            }


            // Tạo response JSON
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("appointments", appointments);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/cancel-appointment")
    public ResponseEntity<Map<String, Object>> cancelAppointment(@RequestBody Map<String, Integer> request,
                                                                 @RequestHeader(value = "aToken", required = false) String aToken)
    {
        try {
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (aToken == null || !validateToken(aToken)) {
                Map<String, Object> unauthorizedResponse = new HashMap<>();
                unauthorizedResponse.put("success", false);
                unauthorizedResponse.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(unauthorizedResponse);
            }

            int appointmentId = Integer.parseInt(request.get("appointmentId").toString());
            AppointmentDto appointment = appointmentService.findAppointmentById(appointmentId);
            if (appointment == null) {
                Map<String, Object> notFoundResponse = new HashMap<>();
                notFoundResponse.put("success", false);
                notFoundResponse.put("message", "Appointment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFoundResponse);
            }

            appointment.setCancelled(true);
            appointmentService.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment cancelled successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all-doctors")
    public ResponseEntity<Map<String, Object>> getAllManagers(@RequestHeader(value = "aToken", required = false) String aToken) {
        try {
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (aToken == null || !validateToken(aToken)) {
                Map<String, Object> unauthorizedResponse = new HashMap<>();
                unauthorizedResponse.put("success", false);
                unauthorizedResponse.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(unauthorizedResponse);
            }

            List<Manager> managers = managerService.findAll();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("doctors", managers);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/change-availability")
    public ResponseEntity<Map<String, Object>> changeAvailability(@RequestBody Map<String, Object> request,
            @RequestHeader(value = "aToken", required = false) String aToken) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Validate token
            if (aToken == null || !validateToken(aToken)) {
                response.put("success", false);
                response.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Check if 'managerId' is provided
            if (!request.containsKey("managerId") || request.get("managerId") == null) {
                response.put("success", false);
                response.put("message", "'managerId' is missing or null in the request body");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Parse 'managerId'
            int managerId;
            try {
                managerId = Integer.parseInt(request.get("managerId").toString());
            } catch (NumberFormatException e) {
                response.put("success", false);
                response.put("message", "'managerId' must be a valid integer");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Fetch doctor by ID
            ManagerDto doctor = managerService.findManagerById(managerId);
            if (doctor == null) {
                response.put("success", false);
                response.put("message", "Manager not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Toggle availability
            // Khi thay đổi status thì cũng đổi isWorking luôn theo
            // status là trạng thái còn làm việc ở cty không
            // isWorking là có sẵn sàng nhận lịch và đi làm hay không
            if (doctor.getStatus() == 1) {
                doctor.setStatus(0);
                doctor.setIsWorking(0); // Set isWorking to 0 when status is 0
            } else {
                doctor.setStatus(1);
                doctor.setIsWorking(1);
            }

            managerService.update(doctor);

            response.put("success", true);
            response.put("message", "Availability changed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getRooms(@RequestHeader(value = "aToken", required = false) String aToken) {
        Map<String, Object> response = new HashMap<>();
        try{
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (aToken == null || !validateToken(aToken)) {
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
    public ResponseEntity<Map<String, Object>> getRoomBookings(@RequestHeader(value = "aToken", required = false) String aToken) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (aToken == null || !validateToken(aToken)) {
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

    @GetMapping("/pet")
    public ResponseEntity<Map<String, Object>> cancelRoomBookings(@RequestHeader(value = "aToken", required = false) String token,
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

    @PostMapping("/notes-room")
    public ResponseEntity<Map<String, Object>> noteRoom(@RequestHeader(value = "aToken", required = false) String dToken,
                                                     @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(dToken)) {
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

}
