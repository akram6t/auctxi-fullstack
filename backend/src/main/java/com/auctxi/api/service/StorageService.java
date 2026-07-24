package com.auctxi.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final S3Client s3Client;

    @Value("${s3.bucket-name}")
    private String bucketName;
    
    @Value("${s3.endpoint}")
    private String endpoint;

    public String uploadFile(MultipartFile file, String folderName) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = folderName + "/" + UUID.randomUUID().toString() + extension;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    // Supabase S3 often requires public-read ACL to make objects publicly accessible natively via URL
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Construct Supabase public URL (Supabase S3 endpoints differ slightly for public URLs)
            // Usually it's: https://[project].supabase.co/storage/v1/object/public/[bucket]/[key]
            // We will parse the endpoint to build the public URL.
            // s3.endpoint = https://tvdjmuhdmtcynhzvjadq.storage.supabase.co/storage/v1/s3
            String publicEndpoint = endpoint.replace("/s3", "/object/public");
            return publicEndpoint + "/" + bucketName + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
