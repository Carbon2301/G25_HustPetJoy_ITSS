package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "total_price")
    private double totalPrice;

    @Column(name = "image")
    private String image;

    @Column(name = "description")
    private String description;


}
