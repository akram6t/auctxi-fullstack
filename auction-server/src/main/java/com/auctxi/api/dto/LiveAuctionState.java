package com.auctxi.api.dto;

import com.auctxi.api.entity.Player;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveAuctionState {
    private Long auctionId;
    private Player currentPlayer;
    private Double currentBid;
    private Long highestBidderTeamId;
    private String highestBidderTeamName;
    private Long endTime; // epoch ms
    private String status; // WAITING, ACTIVE, SOLD, UNSOLD
    
    @Builder.Default
    private List<BidDTO> bids = new ArrayList<>();
}
