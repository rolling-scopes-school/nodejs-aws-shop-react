import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_iam as iam,
  aws_cloudfront as cloudfront,
  aws_s3_deployment as s3deploy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "RsshoolCloudFrontOAI",
      {
        comment: "OAI for my distribution",
      }
    );

    const siteBucket = new s3.Bucket(this, "RsshoolSiteBucket", {
      bucketName: "rsshool-site-bucket",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "RsshoolCloudFrontDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "RsshoolBucketDeployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
