import {
  aws_s3 as s3,
  aws_s3_deployment as s3Deploy,
  aws_iam as iam,
  aws_cloudfront as cloudFront,
  Stack,
  StackProps, RemovalPolicy
} from "aws-cdk-lib";
import {Construct} from "constructs";

// import * as cdk from "@aws-cdk/core";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cloudFrontOAI = new cloudFront.OriginAccessIdentity(this, 'CloudFront.OriginAccessIdentity');

    const siteBucket = new s3.Bucket(this, "Aliaksei-Tsvirko-S3-RS-2024", {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: "aliaksei-tsvirko-s3-rs-2024",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions:["S3:GetObject"],
      resources: [siteBucket.arnForObjects("*")],
      principals: [new iam.CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const cloudFrontWebDistribution = new cloudFront.CloudFrontWebDistribution(this, 'Aliaksei-Tsvirko-CloudFront-RS-2024', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudFrontOAI
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    });

    new s3Deploy.BucketDeployment(this, 'Aliaksei-Tsvirko-S3-Deploy-RS-2024', {
      sources: [s3Deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution: cloudFrontWebDistribution,
      distributionPaths: ["/*"]
    })
  }
}
