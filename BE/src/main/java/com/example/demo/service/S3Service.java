package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;

@Service
public class S3Service {

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.bucketName}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public String uploadFile(MultipartFile file) throws IOException {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);
        S3Client s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .acl("public-read")
                .build();

        PutObjectResponse response = s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        s3Client.close();

        if (response.sdkHttpResponse().isSuccessful()) {
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;
        } else {
            throw new IOException("Error uploading file to S3");
        }
    }
}
