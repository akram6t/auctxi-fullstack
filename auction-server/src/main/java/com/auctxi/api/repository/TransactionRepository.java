package com.auctxi.api.repository;

import com.auctxi.api.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTop5ByOrderByDateDesc();
}
