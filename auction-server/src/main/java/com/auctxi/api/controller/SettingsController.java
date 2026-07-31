package com.auctxi.api.controller;

import com.auctxi.api.entity.SystemSetting;
import com.auctxi.api.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<List<SystemSetting>> getAllSettings() {
        return ResponseEntity.ok(settingsService.getAllSettings());
    }

    @PostMapping
    public ResponseEntity<SystemSetting> saveSetting(@RequestBody SystemSetting setting) {
        return ResponseEntity.ok(settingsService.saveSetting(setting));
    }
}
