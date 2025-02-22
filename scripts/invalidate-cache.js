import { CloudFront } from '@aws-sdk/client-cloudfront';
import { readFileSync } from 'fs';

async function invalidateCache() {
  const cloudfront = new CloudFront({});
  
  // Read the CDK outputs from cdk-outputs.json
  const outputs = JSON.parse(
    readFileSync('./cdk-outputs.json', 'utf-8')
  );
  
  const distributionId = outputs.InfrastructureStack.DistributionId;

  try {
    await cloudfront.createInvalidation({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    });
    console.log('Cache invalidation created successfully');
  } catch (error) {
    console.error('Error creating invalidation:', error);
    process.exit(1);
  }
}

invalidateCache();

