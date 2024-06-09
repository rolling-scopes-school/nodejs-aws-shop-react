import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an Origin Access Identity for CloudFront
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      'MyCloudFrontOAI',
      {
        comment: 'OAI for nodejs-aws-shop-react CloudFront distribution',
      }
    );

    // Use existing S3 bucket
    const bucket = s3.Bucket.fromBucketName(
      this,
      'NodejsAwsShopReactBucket',
      'nodejs-aws-shop-react-project'
    );

    // Grant CloudFront access to the bucket
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // Create a CloudFront distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'NodejsAwsShopReactDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    // Deploy the built React app to the S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
