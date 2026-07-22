package com.auctxi.api.service;

import com.auctxi.api.entity.Player;
import com.auctxi.api.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PlayerRepository playerRepository;

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
