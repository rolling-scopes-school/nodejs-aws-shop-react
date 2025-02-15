// lib/sdk-infra-stack.ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';

export class SdkInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create S3 Bucket (disable public read - we use CloudFront)
    const websiteBucket = new Bucket(this, 'Task2Bucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false, // Block public
    });

    // 2. CloudFront OAI (grants CF read access to bucket)
    const oai = new OriginAccessIdentity(this, 'OAI');

    // 3. CloudFront distribution
    const distribution = new Distribution(this, 'MyDistribution', {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, {
          originAccessIdentity: oai,
        }),
      },
      defaultRootObject: 'index.html',
    });

    // 4. Deploy 'dist/' folder from React to S3
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('../dist')], // path to the dist folder
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'], // Invalidate everything after upload
    });
  }
}
