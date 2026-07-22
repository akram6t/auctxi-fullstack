package com.auctxi.api.service;

import com.auctxi.api.entity.Player;
import com.auctxi.api.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player addPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player updatePlayer(Long id, Player updatedPlayer) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        player.setName(updatedPlayer.getName());
        player.setRole(updatedPlayer.getRole());
        player.setCountry(updatedPlayer.getCountry());
        player.setBasePrice(updatedPlayer.getBasePrice());
        player.setStatus(updatedPlayer.getStatus());
        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }
}
