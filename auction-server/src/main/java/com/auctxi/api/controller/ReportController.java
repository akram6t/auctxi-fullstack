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
        return ResponseEntity.ok(reportService.getPerformanceReport());
    }

    @GetMapping("/financial")
    public ResponseEntity<Map<String, Object>> getFinancialReport() {
        return ResponseEntity.ok(reportService.getFinancialReport());
    }
}
