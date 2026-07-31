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
    
    private String shortName;
    
    private String ownerName;
    
    private String ownerEmail;

    private String purse;
    
    private Integer squadSize;
    
    @Column(columnDefinition = "LONGTEXT")
    private String logoUrl;
    
    private String status;
}
