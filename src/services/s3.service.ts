// src/common/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { S3ConfigService } from 'src/config/s3.config';

@Injectable()
export class S3Service {
  private readonly client: S3;

  constructor(private readonly s3ConfigService: S3ConfigService) {
    this.client = s3ConfigService.getClient();
  }

  // Upload a new cover to S3 and return the URL
  async uploadCover(filePath: string, bucketName: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    const params = {
      Bucket: bucketName,
      Key: `books/covers/${fileName}`, 
      Body: fileStream,
      ContentType: 'image/jpeg', 
    };

    // Upload the file to S3
    await this.client.putObject(params);

    // Return the URL where the cover can be accessed
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  }

  // Update an existing book's cover by replacing the old one in S3
  async updateCover(filePath: string, bucketName: string, oldCoverUrl: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    // Delete the old cover from S3
    const oldCoverKey = this.extractKeyFromUrl(oldCoverUrl);
    await this.client.deleteObject({
      Bucket: bucketName,
      Key: oldCoverKey,
    });

    // Upload the new cover
    const params = {
      Bucket: bucketName,
      Key: `books/covers/${fileName}`,
      Body: fileStream,
      ContentType: 'image/jpeg', // Or dynamically set the type
    };
    await this.client.putObject(params);

    // Return the URL for the new cover
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  }

  // Helper function to extract the file key from the URL (to delete the old cover)
  private extractKeyFromUrl(url: string): string {
    const parts = url.split('/');
    return parts.slice(parts.indexOf('books/covers'), parts.length).join('/');
  }
}
