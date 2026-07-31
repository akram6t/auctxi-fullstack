package com.auctxi.api.controller;

import com.auctxi.api.service.StorageService;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final StorageService storageService;

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, 
                                        @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        try {
            String publicUrl = storageService.uploadFile(file, folder);
            return ResponseEntity.ok(Map.of("url", publicUrl));
        } catch (NoSuchBucketException e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body(Map.of(
                "error", "The bucket 'auctxi-images' does not exist in your Supabase project.",
                "solution", "Please go to your Supabase Dashboard -> Storage and create a new PUBLIC bucket named 'auctxi-images'."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage(), "cause", e.getCause() != null ? e.getCause().getMessage() : ""));
        }
    }
}
