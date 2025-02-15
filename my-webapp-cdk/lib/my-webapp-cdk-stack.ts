import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { CachePolicy, Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class MyWebappCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store web app
    const bucket = new Bucket(this, 'NodejsAwsShopS3', {
      bucketName:'shop-app-bucket-task-2',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    // Create CloudFront distribution
    const distribution = new Distribution(this, 'NodejsAwsShopDistribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    // Deploy site contents to S3
    new BucketDeployment(this, 'NodejsAwsShopDeployment', {
      sources: [Source.asset('../dist')],
      destinationBucket: bucket,
      prune: true,
      distribution,
      distributionPaths: ['/*']
    });

    // Output the CloudFront URL
    new CfnOutput(this, 'NodejsAwsShopDistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'Website URL'
    });
  }
}
