package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="role_name", unique = true, nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "manager_role",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "manager_id")
    )
    @ToString.Exclude
    @JsonIgnore
    private List<Manager> managers;

    public Role(String name) {
        this.name = name;
    }
}
