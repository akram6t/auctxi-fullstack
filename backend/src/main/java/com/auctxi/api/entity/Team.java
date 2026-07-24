package com.auctxi.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    private String ownerEmail;

    private String purse;
    
    private Integer squadSize;
    
    private String logoUrl;
    
    private String status;
}
