package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.*;
import java.text.ParseException;

import static com.example.demo.config.GenToken.generateToken;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/user")
public class UserController {
    private final CustomerService customerService;

    private final S3Service S3Service;

    private final AppointmentService appointmentService;

    private final ManagerService managerService;

    private final TreatmentService treatmentService;

    private final PetService petService;
    private final SpaService spaService;
    private final RoomService roomService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String password = request.get("password");

            if (customerService.login(email, password)) {
                // Tạo token (giả lập)
                String token = generateToken(email, password);

                response.put("success", true);
                response.put("token", token);
                response.put("userId", customerService.findCustomerByEmail(email).getId());
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

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String password = request.get("password");
            String name = request.get("name");

            boolean isRegistered = customerService.register(email, password, name);

            if (isRegistered) {
                response.put("success", true);
                response.put("message", "Registration successful");
            } else {
                response.put("success", false);
                response.put("message", "Registration failed due to invalid credentials or email already registered");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestHeader(value = "token", required = false) String token,
                                                              @RequestParam(value = "userId", required = false) Integer userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            // Fetch profile using service
            CustomerDto profileData = customerService.findCustomerById(userId);
            List<PetDto> pets = petService.findPetByCustomerId(userId);

            profileData.setPets(pets);


            if (profileData != null) {
                response.put("success", true);
                response.put("userData", profileData);
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

    @PostMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateDoctorProfile(
            @RequestHeader(value = "token", required = false) String token,
            @RequestParam("userId") int userId,
            @RequestParam("fullName") String fullName,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam("sex") String gender,
            @RequestParam("dob") String dobString, // Ngày dưới dạng chuỗi
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("pets") String petsJson,  // Danh sách thú cưng dưới dạng chuỗi JSON
            @RequestParam(value = "petImages", required = false) List<MultipartFile> petImages // Danh sách ảnh thú cưng
    ) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            // Parse ngày sinh
            Date dob;
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                dob = dateFormat.parse(dobString);
            } catch (Exception e) {
                response.put("success", false);
                response.put("message", "Invalid date format. Expected format: yyyy-MM-dd");
                return ResponseEntity.badRequest().body(response);
            }

            // Parse chuỗi JSON thành danh sách PetDto
            ObjectMapper objectMapper = new ObjectMapper();
            List<PetDto> pets = Arrays.asList(objectMapper.readValue(petsJson, PetDto[].class));

            // Tìm thông tin khách hàng
            CustomerDto customer = customerService.findCustomerById(userId);

            // Upload avatar nếu có
            String imageUrl = customer != null ? customer.getImage() : null;
            if (image != null && !image.isEmpty()) {
                imageUrl = S3Service.uploadFile(image);
            }

            if (customer != null) {
                // Cập nhật thông tin người dùng
                customer.setFullName(fullName);
                customer.setPhone(phone);
                customer.setAddress(address);
                customer.setImage(imageUrl);
                customer.setSex(gender);
                customer.setDob(dob);
                customerService.update(customer);

                // Cập nhật thú cưng
                for (int i = 0; i < pets.size(); i++) {
                    PetDto pet = pets.get(i);
                    String imagePetUrl = null;

                    imagePetUrl = pet.getImage(); // Giữ ảnh cũ mặc định
                    if (i < petImages.size() && petImages.get(i) != null && !petImages.get(i).isEmpty()) {
                        imagePetUrl = S3Service.uploadFile(petImages.get(i)); // Ghi đè nếu có ảnh mới
                    }

                    pet.setImage(imagePetUrl);
                    pet.setCustomerId(userId);
                    petService.save(pet);
                }

                response.put("success", true);
                response.put("message", "Profile updated successfully.");
            } else {
                response.put("success", false);
                response.put("message", "Customer not found.");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointments(@RequestHeader(value = "token", required = false) String token,
                                                               @RequestParam(value = "userId", required = false) Integer userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            // Fetch appointments using service
            response.put("success", true);
            response.put("appointments", appointmentService.findAppointmentsByCustomerId(userId));

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel-appointment")
    public ResponseEntity<Map<String, Object>> cancelAppointment(@RequestBody Map<String, Integer> request,
                                                                 @RequestHeader(value = "token", required = false) String token)
    {
        try {
            Map<String, Object> response = new HashMap<>();
            // Kiểm tra token nếu cần thiết (tùy vào yêu cầu bảo mật của bạn)
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
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

    @GetMapping("/{managerId}/available-slots")
    public ResponseEntity<Map<String, Object>> getAvailableSlots(@PathVariable int managerId) {
        Map<String, Object> response = new HashMap<>();

        try {
            ManagerDto doctor = managerService.findManagerById(managerId);
            if (doctor == null) {
                response.put("success", false);
                response.put("message", "Manager not found");
                return ResponseEntity.badRequest().body(response);
            }

            List<Map<String, Object>> availableSlots = new ArrayList<>();
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            // Check slots for the next 7 days
            for (int i = 0; i < 7; i++) {
                Map<String, Object> daySlots = new HashMap<>();
                Date currentDate = calendar.getTime();
                daySlots.put("date", sdf.format(currentDate));

                List<String> timeSlots = appointmentService.getAvailableTimeSlots(managerId, currentDate);
                daySlots.put("slots", timeSlots);

                availableSlots.add(daySlots);
                calendar.add(Calendar.DATE, 1);
            }

            response.put("success", true);
            response.put("data", availableSlots);
            response.put("docSlotlength", availableSlots.size());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-payment")
    public ResponseEntity<Map<String, Object>> updatePayment(@RequestBody Map<String, Integer> request,
                                                             @RequestHeader(value = "token", required = false) String token){
        Map<String, Object> response = new HashMap<>();
        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            int appointmentId = Integer.parseInt(request.get("appointmentId").toString());

            AppointmentDto appointment = appointmentService.findAppointmentById(appointmentId);
            appointment.setIsPaid(true);
            appointmentService.save(appointment);

            response.put("success", true);
            response.put("message", "Appointment updated successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @PostMapping("/book-treatment-appointment")
    public ResponseEntity<Map<String, Object>> bookTreatmentAppointment(@RequestBody Map<String, String> request,
                                                               @RequestHeader(value = "token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();


        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            int managerId = Integer.parseInt(request.get("managerId"));
            String slotDate = request.get("slotDate");
            String slotTime = request.get("slotTime");
            int petId = Integer.parseInt(request.get("petId"));
            String petName = request.get("petName");
            String petSpecies = request.get("petSpecies");
            String petImage = request.get("petImage"); // Optional field

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date appointmentDate = sdf.parse(slotDate);
            Time appointmentTime = Time.valueOf(slotTime + ":00");

            // Check if the slot is still available
            boolean isAvailable = appointmentService.isSlotAvailable(managerId, appointmentDate, appointmentTime);
            if (!isAvailable) {
                response.put("success", false);
                response.put("message", "Please choose another time. This one is already booked");
                return ResponseEntity.ok(response);
            }

            AppointmentDto appointmentDto = new AppointmentDto();
            appointmentDto.setPetId(petId);
            appointmentDto.setAppointmentDate(appointmentDate);
            appointmentDto.setAppointmentTime(appointmentTime);
            appointmentDto.setCancelled(false);
            appointmentDto.setIsCompleted(false);
            appointmentDto.setIsPaid(false);
            ManagerDto doctor = managerService.findManagerById(managerId);
            appointmentDto.setManager(doctor);
            AppointmentDto savedAppointment = appointmentService.save(appointmentDto);

            TreatmentDto treatmentDto = new TreatmentDto();
            treatmentDto.setPetId(petId);
            treatmentDto.setManagerId(managerId);
            treatmentDto.setAppointmentId(savedAppointment.getAppointmentId());
            treatmentDto.setFees(100);

            treatmentService.save(treatmentDto);

            response.put("success", true);
            response.put("message", "Appointment booked successfully");
            response.put("appointmentId", savedAppointment.getAppointmentId());

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for managerId or petId");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/book-spa-appointment")
    public ResponseEntity<Map<String, Object>> bookSpaAppointment(@RequestBody Map<String, String> request,
                                                               @RequestHeader(value = "token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();


        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            int managerId = Integer.parseInt(request.get("managerId"));
            String slotDate = request.get("slotDate");
            String slotTime = request.get("slotTime");
            int petId = Integer.parseInt(request.get("petId"));
            String petName = request.get("petName");
            String petSpecies = request.get("petSpecies");
            String petImage = request.get("petImage"); // Optional field

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date appointmentDate = sdf.parse(slotDate);
            Time appointmentTime = Time.valueOf(slotTime + ":00");

            // Check if the slot is still available
            boolean isAvailable = appointmentService.isSlotAvailable(managerId, appointmentDate, appointmentTime);
            if (!isAvailable) {
                response.put("success", false);
                response.put("message", "Please choose another time. This one is already booked");
                return ResponseEntity.ok(response);
            }

            AppointmentDto appointmentDto = new AppointmentDto();
            appointmentDto.setPetId(petId);
            appointmentDto.setAppointmentDate(appointmentDate);
            appointmentDto.setAppointmentTime(appointmentTime);
            appointmentDto.setCancelled(false);
            appointmentDto.setIsCompleted(false);
            appointmentDto.setIsPaid(false);
            ManagerDto doctor = managerService.findManagerById(managerId);
            appointmentDto.setManager(doctor);
            AppointmentDto savedAppointment = appointmentService.save(appointmentDto);

            SpaDto spaDto = new SpaDto();
            spaDto.setPetId(petId);
            spaDto.setManagerId(managerId);
            spaDto.setAppointmentId(savedAppointment.getAppointmentId());
            spaDto.setFees(100);

            spaService.save(spaDto);

            response.put("success", true);
            response.put("message", "Appointment booked successfully");
            response.put("appointmentId", savedAppointment.getAppointmentId());

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for managerId or petId");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/available-rooms")
    public ResponseEntity<Map<String, Object>> getAvailableRooms(@RequestHeader (value = "token", required = false) String token,
                                                                 @RequestParam(value = "startDate") String startDate,
                                                                 @RequestParam(value = "endDate") String endDate)
    {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }
            Date start = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
            Date end = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);

            List<RoomDto> availableRooms = roomService.getAvailableRooms(start, end);

            response.put("success", true);
            response.put("availableRooms", availableRooms);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/book-room")
    public ResponseEntity<Map<String, Object>> bookRoom(@RequestBody Map<String, String> request,
                                                         @RequestHeader(value = "token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate the token
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            int roomId = Integer.parseInt(request.get("roomId"));
            String startDate = request.get("startDate");
            String endDate = request.get("endDate");
            int petId = Integer.parseInt(request.get("petId"));
            Date start = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
            Date end = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);

            RoomDto roomDto = roomService.findRoomById(roomId);
            if (roomDto == null) {
                response.put("success", false);
                response.put("message", "Room not found");
                return ResponseEntity.badRequest().body(response);
            }

            roomService.savePetRoom(roomId, petId, 0, start, end);

            response.put("success", true);
            response.put("message", "Room booked successfully");

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for roomId");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-room-bookings")
    public ResponseEntity<Map<String, Object>> getRoomBookings(
            @RequestHeader(value = "token", required = false) String token,
            @RequestParam(value = "userId", required = false) Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }
            // Lấy danh sách booking phòng từ service
            response.put("success", true);
            response.put("bookings", roomService.findRoomBookingByCustomerId(userId));
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel-room-booking")
    public ResponseEntity<Map<String, Object>> cancelRoomBookings(@RequestHeader(value = "token", required = false) String token,
                                                                  @RequestBody Map<String, Integer> request) {
        Map<String, Object> response = new HashMap<>();
        try{
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            int petRoomId = request.get("bookingId");
            roomService.deletePetRoom(petRoomId);
            response.put("success", true);
            response.put("message", "Room booking cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


}