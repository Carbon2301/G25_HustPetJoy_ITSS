package com.example.demo.service;

import com.example.demo.dto.SpaDto;
import com.example.demo.dto.TreatmentDto;
import com.example.demo.model.Spa;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

public interface SpaService {
    List<Spa> findAll();

    SpaDto save(SpaDto spaDto);

    List<SpaDto> findSpaByManagerId(int managerId);
}
