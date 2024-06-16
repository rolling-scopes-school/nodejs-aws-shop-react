import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class AwsSdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

       const bucket = new s3.Bucket(this, 'AwsReactWebAppBucket', {
        bucketName: 'liza-aws-react-web-app-bucket',
        websiteIndexDocument: 'index.html',
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      });

      const originAccessIdentity = new cloudfront.OriginAccessIdentity(
        this,
        "CloudfrontOAI"
      );

      bucket.addToResourcePolicy(
        new iam.PolicyStatement({
          actions: ["s3:GetObject"],
          resources: [bucket.arnForObjects("*")],
          principals: [
            new iam.CanonicalUserPrincipal(
              originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
            ),
          ],
        })
      );

      const distribution = new cloudfront.CloudFrontWebDistribution(this, 'AwsReactWebAppDistribution', {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      });

      new s3Deployment.BucketDeployment(this, "AwsReactWebAppDeployment", {
        sources: [s3Deployment.Source.asset("../dist")],
        destinationBucket: bucket,
        distribution,
        distributionPaths: ["/*"],
      });
  }
}
