package com.auctxi.api.service;

import com.auctxi.api.entity.Transaction;
import com.auctxi.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction processTransaction(Transaction transaction) {
        transaction.setDate(new Date());
        return transactionRepository.save(transaction);
    }
}
