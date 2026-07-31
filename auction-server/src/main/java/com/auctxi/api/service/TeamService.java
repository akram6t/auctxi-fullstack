package com.auctxi.api.service;

import com.auctxi.api.entity.Team;
import com.auctxi.api.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, Team updatedTeam) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setName(updatedTeam.getName());
        team.setShortName(updatedTeam.getShortName());
        team.setOwnerName(updatedTeam.getOwnerName());
        team.setOwnerEmail(updatedTeam.getOwnerEmail());
        team.setPurse(updatedTeam.getPurse());
        team.setSquadSize(updatedTeam.getSquadSize());
        team.setLogoUrl(updatedTeam.getLogoUrl());
        team.setStatus(updatedTeam.getStatus());
        return teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
