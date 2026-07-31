package com.auctxi.api.service;

import com.auctxi.api.dto.BidDTO;
import com.auctxi.api.dto.LiveAuctionState;
import com.auctxi.api.entity.Auction;
import com.auctxi.api.entity.Player;
import com.auctxi.api.entity.Team;
import com.auctxi.api.entity.Transaction;
import com.auctxi.api.repository.AuctionRepository;
import com.auctxi.api.repository.PlayerRepository;
import com.auctxi.api.repository.TeamRepository;
import com.auctxi.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class LiveAuctionService {

    private final AuctionRepository auctionRepository;
    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final TransactionRepository transactionRepository;

    private final Map<Long, LiveAuctionState> activeAuctions = new ConcurrentHashMap<>();

    private long getTimerDurationMs(Long auctionId) {
        return auctionRepository.findById(auctionId)
                .map(a -> a.getTimerTimeout() != null ? a.getTimerTimeout() * 1000L : 15000L)
                .orElse(15000L);
    }

    public LiveAuctionState getState(Long auctionId) {
        return activeAuctions.getOrDefault(auctionId, LiveAuctionState.builder()
                .auctionId(auctionId)
                .status("WAITING")
                .build());
    }

    public LiveAuctionState startPlayerAuction(Long auctionId, Long playerId) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new RuntimeException("Player not found"));
        
        double parsedBasePrice = 0.0;
        if (player.getBasePrice() != null && !player.getBasePrice().trim().isEmpty()) {
            try {
                parsedBasePrice = Double.parseDouble(player.getBasePrice().replace(",", "").replace("$", "").replaceAll("[^0-9.]", ""));
            } catch (Exception e) {
                parsedBasePrice = 0.0;
            }
        }

        LiveAuctionState state = LiveAuctionState.builder()
                .auctionId(auctionId)
                .currentPlayer(player)
                .currentBid(parsedBasePrice)
                .highestBidderTeamId(null)
                .highestBidderTeamName(null)
                .endTime(System.currentTimeMillis() + getTimerDurationMs(auctionId))
                .status("ACTIVE")
                .build();
                
        activeAuctions.put(auctionId, state);
        return state;
    }

    public LiveAuctionState placeBid(Long auctionId, Long teamId, Double amount) {
        LiveAuctionState state = activeAuctions.get(auctionId);
        if (state == null || !"ACTIVE".equals(state.getStatus())) {
            throw new RuntimeException("Auction is not active");
        }
        
        if (System.currentTimeMillis() > state.getEndTime()) {
            throw new RuntimeException("Time is up");
        }

        if (amount <= state.getCurrentBid() && state.getHighestBidderTeamId() != null) {
            throw new RuntimeException("Bid amount must be higher than current bid");
        }

        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        state.setCurrentBid(amount);
        state.setHighestBidderTeamId(teamId);
        state.setHighestBidderTeamName(team.getName());
        state.setEndTime(System.currentTimeMillis() + getTimerDurationMs(auctionId));
        
        state.getBids().add(0, BidDTO.builder()
                .teamId(teamId)
                .teamName(team.getName())
                .amount(amount)
                .timestamp(new Date())
                .build());
                
        return state;
    }

    @Transactional
    public LiveAuctionState sellPlayer(Long auctionId) {
        LiveAuctionState state = activeAuctions.get(auctionId);
        if (state == null || !"ACTIVE".equals(state.getStatus())) {
            throw new RuntimeException("Auction is not active");
        }
        
        if (state.getHighestBidderTeamId() == null) {
            return markUnsold(auctionId);
        }

        Player player = state.getCurrentPlayer();
        Team team = teamRepository.findById(state.getHighestBidderTeamId()).orElseThrow();

        // Update player
        player.setTeam(team);
        player.setStatus("Sold");
        playerRepository.save(player);

        // Update team purse
        try {
            double currentPurse = Double.parseDouble(team.getPurse().replace(",", ""));
            currentPurse -= state.getCurrentBid();
            team.setPurse(String.format("%.0f", currentPurse));
            teamRepository.save(team);
        } catch (Exception e) {
            // ignore parse errors for mock data
        }

        Auction auction = auctionRepository.findById(auctionId).orElse(null);
        String eventName = auction != null ? auction.getName() : "Event " + auctionId;

        // Create transaction
        Transaction transaction = Transaction.builder()
                .date(new Date())
                .amount(state.getCurrentBid())
                .type("Player Purchase")
                .status("Success")
                .reference("LDG-" + System.currentTimeMillis())
                .teamName(team.getName())
                .eventName(eventName)
                .playerName(player.getName())
                .build();
        transactionRepository.save(transaction);

        state.setStatus("SOLD");
        return state;
    }

    @Transactional
    public LiveAuctionState markUnsold(Long auctionId) {
        LiveAuctionState state = activeAuctions.get(auctionId);
        if (state == null || !"ACTIVE".equals(state.getStatus())) {
            throw new RuntimeException("Auction is not active");
        }
        
        Player player = state.getCurrentPlayer();
        player.setStatus("Unsold");
        playerRepository.save(player);

        state.setStatus("UNSOLD");
        return state;
    }
}
