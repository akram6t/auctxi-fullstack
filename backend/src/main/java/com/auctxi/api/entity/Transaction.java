package com.auctxi.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;

    private Double amount;

    private String type; // CREDIT, DEBIT

    private String status; // COMPLETED, PENDING, FAILED

    private String reference;
}
