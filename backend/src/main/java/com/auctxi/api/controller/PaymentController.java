package com.auctxi.api.controller;

import com.auctxi.api.entity.Transaction;
import com.auctxi.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(paymentService.getAllTransactions());
    }

    @PostMapping
    public ResponseEntity<Transaction> processTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(paymentService.processTransaction(transaction));
    }
}
