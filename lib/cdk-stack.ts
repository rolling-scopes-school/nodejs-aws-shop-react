import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "NodejsAwsShopReactOai"
    );

    const bucket = new s3.Bucket(this, "NodejsAwsShopReact", {
      bucketName: "lobovskiy-nodejs-aws-shop-react-bucket",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
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

    const cloudFrontWebDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "NodejsAwsShopReactWebDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new s3Deployment.BucketDeployment(
      this,
      "NodejsAwsShopReactBucketDeployment",
      {
        sources: [s3Deployment.Source.asset("./dist")],
        destinationBucket: bucket,
        distribution: cloudFrontWebDistribution,
        distributionPaths: ["/*"],
      }
    );

    new cdk.CfnOutput(this, "BucketUrl", {
      value: bucket.bucketWebsiteUrl,
    });
    new cdk.CfnOutput(this, "CloudfrontUrl", {
      value: cloudFrontWebDistribution.distributionDomainName,
    });
  }
}
