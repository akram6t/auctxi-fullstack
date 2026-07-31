package com.auctxi.api.service;

import com.auctxi.api.entity.Auction;
import com.auctxi.api.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public Auction createAuction(Auction auction) {
        return auctionRepository.save(auction);
    }

    public Auction updateAuction(Long id, Auction updatedAuction) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        auction.setName(updatedAuction.getName());
        auction.setDate(updatedAuction.getDate());
        auction.setStatus(updatedAuction.getStatus());
        auction.setTotalPlayers(updatedAuction.getTotalPlayers());
        auction.setBudgetCap(updatedAuction.getBudgetCap());
        
        if (updatedAuction.getTimerTimeout() != null) {
            auction.setTimerTimeout(updatedAuction.getTimerTimeout());
        }
        if (updatedAuction.getRules() != null) {
            auction.setRules(updatedAuction.getRules());
        }
        
        return auctionRepository.save(auction);
    }

    public void deleteAuction(Long id) {
        auctionRepository.deleteById(id);
    }
}
