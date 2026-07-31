package com.auctxi.api.service;

import com.auctxi.api.entity.User;
import com.auctxi.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserStatus(Long id, String status) {
        User user = getUserById(id);
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        System.out.println("Received update for user " + id + ": " + updatedUser);
        User user = getUserById(id);
        System.out.println("Existing user: " + user);
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getImageUrl() != null) user.setImageUrl(updatedUser.getImageUrl());
        if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());
        if (updatedUser.getStatus() != null) user.setStatus(updatedUser.getStatus());
        if (updatedUser.getPreferences() != null) user.setPreferences(updatedUser.getPreferences());
        
        User savedUser = userRepository.save(user);
        System.out.println("Saved user: " + savedUser);
        return savedUser;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
