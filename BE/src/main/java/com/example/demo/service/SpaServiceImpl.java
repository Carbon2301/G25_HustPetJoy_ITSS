package com.example.demo.service;

import com.example.demo.dto.SpaDto;
import com.example.demo.model.Spa;
import com.example.demo.repository.SpaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RequiredArgsConstructor
@Service
public class SpaServiceImpl implements SpaService {

    private final SpaRepository spaRepository;

    private final ModelMapper modelMapper;

    @Override
    public List<Spa> findAll() {
        return spaRepository.findAll();
    }

    @Override
    public SpaDto save(SpaDto spaDto) {
        Spa spa = toEntity(spaDto);
        spa = spaRepository.save(spa);
        return toDto(spa);
    }

    private Spa toEntity(SpaDto spaDto) {
        Spa spa = modelMapper.map(spaDto, Spa.class);
        return spa;
    }

    private SpaDto toDto(Spa spa) {
        int petId = spa.getPet().getId();
        int managerId = spa.getManager().getId();
        SpaDto spaDto = modelMapper.map(spa, SpaDto.class);
        spaDto.setPetId(petId);
        spaDto.setManagerId(managerId);
        return spaDto;
    }

    @Override
    public List<SpaDto> findSpaByManagerId(int managerId) {
        List<Spa> spas = spaRepository.findSpaByManagerId(managerId);
        return spas.stream().map(this::toDto).toList();
    }
}
