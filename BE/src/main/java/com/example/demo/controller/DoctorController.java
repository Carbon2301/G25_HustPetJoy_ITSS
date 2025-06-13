package com.example.demo.controller;


import com.example.demo.dto.*;
import com.example.demo.model.Manager;
import com.example.demo.model.Medicine;
import com.example.demo.model.Prescription;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.demo.config.GenToken.generateToken;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/doctor")
public class DoctorController {
    private final ManagerService managerService;

    private final CustomerService customerService;

    private final TreatmentService treatmentService;

    private final PrescriptionService prescriptionService;

    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final PetService petService;
    private final MedicineService medicineService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginManager(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String password = request.get("password");
            if (!managerService.checkDoctor(email)) {
                response.put("success", false);
                response.put("message", "You are not Doctor");
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

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getDoctorProfile(@RequestHeader(value = "dToken", required = false) String dToken,
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
            @RequestHeader(value = "dToken", required = false) String dToken,
            @RequestBody Map<String, Object> updateData) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra tính hợp lệ của token
            if (dToken == null || dToken.isEmpty()) {
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



    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestHeader(value = "dToken", required = false) String dToken,
                                                            @RequestParam(value = "managerId", required = false) Integer managerId) {
        try {
            if (validateToken(dToken)) {
                Map<String, Object> response = new HashMap<>();
            }
            List<AppointmentDto> appointments = appointmentService.findAppointmentByDoctorId(managerId);
//            List<CustomerDto> customers = customerService.findCustomerByManagerId(managerId);
            List<PetDto> pets = petService.findPetByDoctorId(managerId);
            List<TreatmentDto> treatments = treatmentService.findTreatmentByManagerId(managerId);
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> dashData = new HashMap<>();


            // Lấy danh sách fees
            List<Double> feesList = treatments.stream()
                    .map(TreatmentDto::getFees) // Giữ nguyên kiểu Double
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
    public ResponseEntity<Map<String, Object>> cancelAppointment(@RequestHeader(value = "dToken", required = false) String dToken,
                                                                 @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(dToken)) {
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
    public ResponseEntity<Map<String, Object>> completeAppointment(@RequestHeader(value = "dToken", required = false) String dToken,
                                                                   @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(dToken)) {
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

    @PostMapping("/follow-up-appointment")
    public ResponseEntity<Map<String, Object>> followUpAppointment(@RequestHeader(value = "dToken", required = false) String dToken,
                                                                   @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(dToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            int appointmentId = (int) request.get("appointmentId");
            AppointmentDto appointment = appointmentService.findAppointmentById(appointmentId);
            String followUpDate = request.get("followUpDate").toString();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date appointmentDate = sdf.parse(appointment.getAppointmentDate().toString());
            Date followUp = sdf.parse(followUpDate);
            appointment.setFollowUpDate(followUp);

            // Format date in mm/dd/yyyy


            appointment.setFollowUpNotification("Bác sĩ đã hẹn lịch tái khám của lịch khám ngày " + appointment.getAppointmentDate() + ", nhấn vào để xem");
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
    @PostMapping("/notes-appointment")
    public ResponseEntity<Map<String, Object>> noteA(@RequestHeader(value = "dToken", required = false) String dToken,
                                                     @RequestBody Map<String, Object> request) {
        try {
            if (!validateToken(dToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            int appointmentId = (int) request.get("appointmentId");
            AppointmentDto appointment = appointmentService.findAppointmentById(appointmentId);
            String notes = request.get("notes").toString();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date appointmentDate = sdf.parse(appointment.getAppointmentDate().toString());
            appointment.setNotes(notes);
            appointment.setNoteNotification("Bác sĩ đã chẩn đoán tình trạng sức khỏe cho thú cưng của bạn của lịch khám ngày "+appointment.getAppointmentDate()+", nhấn vào để xem");
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
    public ResponseEntity<Map<String, Object>> getAppointments(@RequestHeader(value = "dToken", required = false) String dToken,
                                                               @RequestParam(value = "managerId", required = false) Integer managerId) {
        try {
            if (!validateToken(dToken)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            List<AppointmentDto> appointments = appointmentService.findAppointmentByDoctorId(managerId);
            List<TreatmentDto> treatments = treatmentService.findTreatmentByManagerId(managerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            // Lấy danh sách fees
            List<String> feesList = treatments.stream()
                    .map(treatment -> String.valueOf(treatment.getFees())) // Chuyển từ Double sang String
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

    // Dung cho ben User
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllManagers() {
        try {

            List<Manager> managers = managerService.findAll();
            managers.remove(0);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("doctors", managers);
            response.put("length", managers.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/add-medicine")
    public ResponseEntity<Map<String, Object>> addMedicine(
            @RequestHeader(value = "dToken", required = false) String dToken,
            @RequestBody Map<String, Object> medicineData,
            @RequestParam int appointmentId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate token
            if (dToken == null || dToken.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate appointment exists
            if (!appointmentRepository.existsById(appointmentId)) {
                response.put("success", false);
                response.put("message", "Appointment not found");
                return ResponseEntity.badRequest().body(response);
            }

            String medicineName = (String) medicineData.get("name");
            String type = (String) medicineData.get("type");

            if (medicineName == null || type == null) {
                response.put("success", false);
                response.put("message", "Medicine name and type are required");
                return ResponseEntity.badRequest().body(response);
            }

            Medicine medicine = medicineService.findByTypeAndMedicineName(medicineName, type);
            if (medicine == null) {
                response.put("success", false);
                response.put("message", "Medicine not found");
                return ResponseEntity.badRequest().body(response);
            }

            prescriptionService.savePrescription(appointmentId, medicine);
            response.put("success", true);
            response.put("message", "Medicine added successfully");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-medicines")
    public ResponseEntity<Map<String, Object>> getAllMedicines(@RequestHeader(value = "dToken", required = false) String dToken, @RequestParam int appointmentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Validate token
            if (dToken == null || dToken.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token is missing or invalid");
                return ResponseEntity.badRequest().body(response);
            }

            List<Medicine> medicines = prescriptionService.getPrescriptionByTreatmentId(appointmentId);
            double totalPrice = 0;
            for(Medicine medicine : medicines ) {
                totalPrice += medicine.getTotalPrice();
            }

            response.put("success", true);
            response.put("medicines", medicines);
            response.put("totalPrice", totalPrice);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);

    }
    @GetMapping("/pet")
    public ResponseEntity<Map<String, Object>> cancelRoomBookings(@RequestHeader(value = "dToken", required = false) String token,
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

    private boolean validateToken(String token) {
        // Thêm logic để xác thực token tại đây
        return true; // Trả về true nếu hợp lệ, false nếu không
    }

}


