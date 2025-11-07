import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Resource } from 'sst';
import { Express } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Post, Redirect, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiKeyAuth } from './auth/auth.decorator';

const s3 = new S3Client({});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Upload a file to S3',
    description:
      'Uploads a file to the configured S3 bucket. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: Resource.MyBucket.name,
      ContentType: file.mimetype,
      Key: file.originalname,
      Body: file.buffer,
    };

    const upload = new Upload({
      params,
      client: s3,
    });

    await upload.done();

    return 'File uploaded successfully.';
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Get the latest file from S3',
    description:
      'Retrieves the latest uploaded file from the configured S3 bucket and provides a signed URL. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Get('latest')
  @Redirect('/', 302)
  async getLatestFile() {
    const objects = await s3.send(
      new ListObjectsV2Command({
        Bucket: Resource.MyBucket.name,
      }),
    );

    const latestFile = objects.Contents.sort(
      (a, b) => b.LastModified.getTime() - a.LastModified.getTime(),
    )[0];

    const command = new GetObjectCommand({
      Key: latestFile.Key,
      Bucket: Resource.MyBucket.name,
    });
    const url = await getSignedUrl(s3, command);

    return { url };
  }
}
