package com.auctxi.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import com.auctxi.api.service.ReportService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryReport() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }

    @GetMapping("/performance")
    public ResponseEntity<Map<String, Object>> getPerformanceReport() {
        // Stub implementation
        Map<String, Object> report = new HashMap<>();
        report.put("message", "Performance report data will go here");
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/financial")
    public ResponseEntity<Map<String, Object>> getFinancialReport() {
        // Stub implementation
        Map<String, Object> report = new HashMap<>();
        report.put("message", "Financial report data will go here");
        return ResponseEntity.ok(report);
    }
}
