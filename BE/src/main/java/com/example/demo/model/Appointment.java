package com.example.demo.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;

@Entity
@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "appointment_date")
    private Date appointmentDate;

    @Column(name = "appointment_time")
    private Time appointmentTime;

    @Column(name = "notes")
    private String notes;

    @Column(name = "cancelled")
    private Boolean cancelled;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Column(name = "service")
    private String service;

    @Column(name = "follow_up_date")
    private Date followUpDate;

    @Column(name = "note_notification")
    private String noteNotification;

    @Column(name = "follow_up_notification")
    private String followUpNotification;

}
