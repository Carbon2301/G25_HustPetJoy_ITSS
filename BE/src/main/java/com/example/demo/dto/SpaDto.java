package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpaDto {
    private int spaId;
    private int petId;
    private int managerId;
    private double fees;
    private String notes;
    private int appointmentId;
}
