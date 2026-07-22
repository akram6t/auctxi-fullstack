package com.auctxi.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String role; // e.g. Batter, Bowler

    private String country;

    private String basePrice;

    private String status; // Available, Sold, Unsold

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
}
