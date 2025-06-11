package com.example.demo.dto;

import com.example.demo.model.Customer;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetDto {
    private int id;
    private String name;
    private double weight;
    private String image;
    private String species;
    private String health;
    private String note;
    private int customerId;

}
