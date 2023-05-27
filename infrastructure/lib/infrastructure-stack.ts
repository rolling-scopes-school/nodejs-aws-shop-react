import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "ShopFrontendOAI")

    const bucket = new s3.Bucket(this, "ShopFrontendBucket", {
      bucketName: "shop-frontend-bucket-dazik",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    })

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
      })
    )

    const distribution = new cloudfront.CloudFrontWebDistribution(this, "ShopFrontendDistribution", {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: cloudfrontOAI
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    })

    new s3deploy.BucketDeployment(this, "ShopFrontendDeployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"]
    })
  }
}
