package com.auctxi.api.service;

import com.auctxi.api.repository.AuctionRepository;
import com.auctxi.api.repository.PlayerRepository;
import com.auctxi.api.repository.TeamRepository;
import com.auctxi.api.repository.UserRepository;
import com.auctxi.api.repository.TransactionRepository;
import com.auctxi.api.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final AuctionRepository auctionRepository;
    private final TransactionRepository transactionRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPlayers", playerRepository.count());
        stats.put("totalTeams", teamRepository.count());
        stats.put("totalAuctions", auctionRepository.count());
        return stats;
    }

    public java.util.List<Map<String, Object>> getRecentActivities() {
        java.util.List<Transaction> txns = transactionRepository.findTop5ByOrderByDateDesc();
        java.util.List<Map<String, Object>> activities = new java.util.ArrayList<>();
        for (Transaction t : txns) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", t.getId());
            activity.put("type", "payment");
            activity.put("description", "Transaction: " + t.getReference() + " for $" + t.getAmount());
            activity.put("time", t.getDate());
            activities.add(activity);
        }
        return activities;
    }
}
