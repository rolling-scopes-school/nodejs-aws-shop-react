import { Stack, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

import Config from "../config";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cloudFrontOAI = new cf.OriginAccessIdentity(this, "AWSFEOAI");

    const bucket = new s3.Bucket(this, "AWSFEStaticBucket", {
      bucketName: Config.AWS_S3_BUCKET_NAME,
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

    const distribution = new cf.CloudFrontWebDistribution(
      this,
      "AWSFEStaticBucketCFDistribution",
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

    new s3deploy.BucketDeployment(this, "AWSFEStaticBucketDeployment", {
      distribution,
      distributionPaths: ["/*"],
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: bucket,
    });
  }
}
