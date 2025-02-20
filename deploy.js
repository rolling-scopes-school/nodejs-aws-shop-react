import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { fromSSO } from '@aws-sdk/credential-provider-sso';
import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import mime from 'mime-types';
import 'dotenv/config';

const config = {
  region: process.env.AWS_REGION,
  credentials: fromSSO({ profile: process.env.AWS_PROFILE })
};

const s3Client = new S3Client(config);
const cloudfrontClient = new CloudFrontClient(config);

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID;

async function uploadFile(filePath, bucketPath) {
  const fileContent = await readFile(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  const params = {
    Bucket: BUCKET_NAME,
    Key: bucketPath,
    Body: fileContent,
    ContentType: contentType
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log(`Successfully uploaded ${bucketPath}`);
  } catch (err) {
    console.error(`Error uploading ${bucketPath}:`, err);
    throw err;
  }
}

async function uploadDirectory(directoryPath, s3Path = '') {
  const files = await readdir(directoryPath);

  for (const file of files) {
    const filePath = join(directoryPath, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      await uploadDirectory(filePath, join(s3Path, file));
    } else {
      const bucketPath = join(s3Path, file);
      await uploadFile(filePath, bucketPath);
    }
  }
}

async function invalidateCache() {
  const params = {
    DistributionId: DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  };

  try {
    const data = await cloudfrontClient.send(new CreateInvalidationCommand(params));
    console.log('Cache invalidation created:', data.Invalidation.Id);
  } catch (err) {
    console.error('Error invalidating cache:', err);
    throw err;
  }
}

async function deploy() {
  try {
    console.log('Starting deployment...');
    
    // Upload files to S3
    await uploadDirectory('dist');
    console.log('Successfully uploaded all files to S3');

    // Invalidate CloudFront cache
    await invalidateCache();
    console.log('Deployment completed successfully!');
  } catch (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  }
}

deploy();
