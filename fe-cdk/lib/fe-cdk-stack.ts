import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class FeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "rs-shop-OAI"
    );

    const bucket = new s3.Bucket(this, "rsShopBucket", {
      bucketName: "rs-shop-bucket",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "rs-shop-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "rs-shop-bucket-deployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
