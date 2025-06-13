package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Time;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {
    private int appointmentId;
    private String petName;
    private int petId;
    private String petImgUrl;
    private String customerName;
    private String customerImgUrl;
    private Date appointmentDate;
    private Time appointmentTime;
    private String notes;
    private Boolean cancelled;
    private Boolean isCompleted;
    private ManagerDto manager;
    private double fees;
    private Boolean isPaid;
    private Date followUpDate;
    private String noteNotification;
    private String followUpNotification;

}
