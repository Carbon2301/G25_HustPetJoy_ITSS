package com.example.demo.config;

import com.example.demo.dto.SpaDto;
import com.example.demo.dto.TreatmentDto;
import com.example.demo.model.Spa;
import com.example.demo.model.Treatment;
import org.modelmapper.PropertyMap;

public class SpaDtoToSpaMap extends PropertyMap<SpaDto, Spa> {
    @Override
    protected void configure() {
        map().setId(source.getSpaId());
    }
}
