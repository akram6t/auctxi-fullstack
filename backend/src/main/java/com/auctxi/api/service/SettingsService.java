package com.auctxi.api.service;

import com.auctxi.api.entity.SystemSetting;
import com.auctxi.api.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SystemSettingRepository settingsRepository;

    public List<SystemSetting> getAllSettings() {
        return settingsRepository.findAll();
    }

    public SystemSetting getSetting(String key) {
        return settingsRepository.findBySettingKey(key).orElse(null);
    }

    public SystemSetting saveSetting(SystemSetting setting) {
        SystemSetting existing = getSetting(setting.getSettingKey());
        if (existing != null) {
            existing.setSettingValue(setting.getSettingValue());
            return settingsRepository.save(existing);
        }
        return settingsRepository.save(setting);
    }
}
