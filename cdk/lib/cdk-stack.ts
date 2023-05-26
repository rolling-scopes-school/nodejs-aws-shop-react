import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BucketAccessControl } from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { BlockPublicAccess } from "@aws-cdk/aws-s3";
import { aws_cloudfront, aws_iam } from "aws-cdk-lib";

export class EShopAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const cloudFrontOAI = new aws_cloudfront.OriginAccessIdentity(this, 'E2XIYPV8ESFQTF')
    // Create S3 Bucket
    const bucket = new s3.Bucket(this, 'EShopAppBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    bucket.addToResourcePolicy(
      new aws_iam.PolicyStatement({
        actions: ['s3:GetObject'],
        effect: aws_iam.Effect.ALLOW,
        principals: [new aws_iam.CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
        resources: [bucket.arnForObjects('*')]
      })
    )

    // Create CloudFront Distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'EShopAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudFrontOAI
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    // Deploy React app to S3 Bucket
    new s3deploy.BucketDeployment(this, 'EShopAppDeployment', {
      sources: [s3deploy.Source.asset('./dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"]
    });
  }
}
