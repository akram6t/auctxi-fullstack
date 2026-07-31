package com.auctxi.api.controller;

import com.auctxi.api.dto.LiveAuctionState;
import com.auctxi.api.service.LiveAuctionService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/live-auctions")
@RequiredArgsConstructor
public class LiveAuctionController {

    private final LiveAuctionService liveAuctionService;

    @GetMapping("/{auctionId}")
    public ResponseEntity<LiveAuctionState> getState(@PathVariable Long auctionId) {
        return ResponseEntity.ok(liveAuctionService.getState(auctionId));
    }

    @PostMapping("/{auctionId}/start-player/{playerId}")
    public ResponseEntity<LiveAuctionState> startPlayerAuction(@PathVariable Long auctionId, @PathVariable Long playerId) {
        return ResponseEntity.ok(liveAuctionService.startPlayerAuction(auctionId, playerId));
    }

    @PostMapping("/{auctionId}/bid")
    public ResponseEntity<LiveAuctionState> placeBid(@PathVariable Long auctionId, @RequestBody BidRequest req) {
        return ResponseEntity.ok(liveAuctionService.placeBid(auctionId, req.getTeamId(), req.getAmount()));
    }

    @PostMapping("/{auctionId}/sell")
    public ResponseEntity<LiveAuctionState> sellPlayer(@PathVariable Long auctionId) {
        return ResponseEntity.ok(liveAuctionService.sellPlayer(auctionId));
    }

    @PostMapping("/{auctionId}/unsold")
    public ResponseEntity<LiveAuctionState> markUnsold(@PathVariable Long auctionId) {
        return ResponseEntity.ok(liveAuctionService.markUnsold(auctionId));
    }
}

@Data
class BidRequest {
    private Long teamId;
    private Double amount;
}
