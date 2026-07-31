package com.auctxi.api.service;

import com.auctxi.api.entity.Player;
import com.auctxi.api.entity.Team;
import com.auctxi.api.entity.Transaction;
import com.auctxi.api.repository.PlayerRepository;
import com.auctxi.api.repository.TeamRepository;
import com.auctxi.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final TransactionRepository transactionRepository;

    public Map<String, Object> getSummaryReport() {
        List<Player> allPlayers = playerRepository.findAll();
        
        long soldPlayersCount = allPlayers.stream().filter(p -> "Sold".equalsIgnoreCase(p.getStatus())).count();
        long unsoldPlayersCount = allPlayers.size() - soldPlayersCount;
        
        List<Map<String, Object>> pieData = new ArrayList<>();
        Map<String, Object> soldData = new HashMap<>();
        soldData.put("name", "Sold Players");
        soldData.put("value", soldPlayersCount);
        soldData.put("color", "#10b981");
        
        Map<String, Object> unsoldData = new HashMap<>();
        unsoldData.put("name", "Unsold Players");
        unsoldData.put("value", unsoldPlayersCount);
        unsoldData.put("color", "#ef4444");
        
        pieData.add(soldData);
        pieData.add(unsoldData);
        
        double totalMoney = 0;
        List<Player> soldPlayers = allPlayers.stream()
                .filter(p -> "Sold".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.toList());
                
        soldPlayers.sort((p1, p2) -> {
            Double val1 = parsePrice(p1.getBasePrice());
            Double val2 = parsePrice(p2.getBasePrice());
            return val2.compareTo(val1);
        });
        
        for(Player p : soldPlayers) {
            totalMoney += parsePrice(p.getBasePrice());
        }
        
        List<Map<String, String>> topBuys = new ArrayList<>();
        for (int i = 0; i < Math.min(3, soldPlayers.size()); i++) {
            Player p = soldPlayers.get(i);
            Map<String, String> buy = new HashMap<>();
            buy.put("name", p.getName());
            buy.put("team", p.getTeam() != null ? p.getTeam().getName() : "Unknown");
            buy.put("price", p.getBasePrice());
            topBuys.add(buy);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("pieData", pieData);
        result.put("topBuys", topBuys);
        result.put("totalPlayersSold", soldPlayersCount);
        result.put("totalMoneySpent", String.format("$%.1fM", totalMoney / 1000000.0));
        result.put("unsoldPlayers", unsoldPlayersCount);
        
        return result;
    }

    public Map<String, Object> getPerformanceReport() {
        List<Team> teams = teamRepository.findAll();
        List<Map<String, Object>> teamStats = new ArrayList<>();
        
        for (Team team : teams) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("name", team.getName());
            
            Double totalPurse = parsePrice(team.getPurse());
            Double remainingPurse = totalPurse; // Assume purse field is the remaining purse. We need total. 
            // In Auctxi, usually purse is remaining. If we don't have total, we just show remaining.
            stats.put("remainingPurse", remainingPurse);
            
            int squadSize = team.getSquadSize() != null ? team.getSquadSize() : 0;
            stats.put("squadSize", squadSize);
            
            teamStats.add(stats);
        }
        
        // Sort by remaining purse (least to most)
        teamStats.sort((t1, t2) -> ((Double)t1.get("remainingPurse")).compareTo((Double)t2.get("remainingPurse")));

        Map<String, Object> result = new HashMap<>();
        result.put("teamStats", teamStats);
        return result;
    }

    public Map<String, Object> getFinancialReport() {
        List<Transaction> transactions = transactionRepository.findAll();
        
        double totalRevenue = 0;
        int successCount = 0;
        int pendingCount = 0;
        int failedCount = 0;
        
        Map<String, Double> revenueByType = new HashMap<>();
        
        for (Transaction txn : transactions) {
            if ("Success".equalsIgnoreCase(txn.getStatus()) || "COMPLETED".equalsIgnoreCase(txn.getStatus())) {
                totalRevenue += (txn.getAmount() != null ? txn.getAmount() : 0.0);
                successCount++;
                
                String type = txn.getType() != null ? txn.getType() : "Unknown";
                revenueByType.put(type, revenueByType.getOrDefault(type, 0.0) + (txn.getAmount() != null ? txn.getAmount() : 0.0));
            } else if ("Pending".equalsIgnoreCase(txn.getStatus())) {
                pendingCount++;
            } else {
                failedCount++;
            }
        }
        
        List<Map<String, Object>> typeData = new ArrayList<>();
        String[] colors = {"#3b82f6", "#10b981", "#f59e0b", "#6366f1"};
        int colorIdx = 0;
        
        for (Map.Entry<String, Double> entry : revenueByType.entrySet()) {
            Map<String, Object> data = new HashMap<>();
            data.put("name", entry.getKey());
            data.put("value", entry.getValue());
            data.put("color", colors[colorIdx % colors.length]);
            typeData.add(data);
            colorIdx++;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", String.format("$%.2f", totalRevenue));
        result.put("successCount", successCount);
        result.put("pendingCount", pendingCount);
        result.put("failedCount", failedCount);
        result.put("revenueByType", typeData);
        
        return result;
    }
    
    private Double parsePrice(String priceStr) {
        if (priceStr == null) return 0.0;
        String clean = priceStr.replaceAll("[^0-9.]", "");
        try {
            return clean.isEmpty() ? 0.0 : Double.parseDouble(clean);
        } catch(Exception e) {
            return 0.0;
        }
    }
}
