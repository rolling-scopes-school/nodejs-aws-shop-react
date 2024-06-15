import {
  aws_s3,
  aws_iam as iam,
  aws_s3_deployment,
  Stack,
  StackProps,
  aws_cloudfront,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class AwsStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const originAccessIdentity = new aws_cloudfront.OriginAccessIdentity(
      this,
      "BaseCfOriginAccessIdentity"
    );

    const bucket = new aws_s3.Bucket(this, "t2-s3-aws-shop", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
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

    const distribution = new aws_cloudfront.CloudFrontWebDistribution(
      this,
      "CloudFrontDistribution",
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

    new aws_s3_deployment.BucketDeployment(this, "deployStaticWebsiteToS3", {
      sources: [aws_s3_deployment.Source.asset("../dist")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
