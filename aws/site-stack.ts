import { Stack, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as awsCloudfront from "aws-cdk-lib/aws-cloudfront";
import * as awsIam from "aws-cdk-lib/aws-iam";
import { Effect } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const originAccessIdentity = new awsCloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: "aglazkov5-rs-aws-react-site",
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: "index.html",
    });

    siteBucket.addToResourcePolicy(
      new awsIam.PolicyStatement({
        effect: Effect.ALLOW,
        principals: [
          new awsIam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
        resources: [siteBucket.arnForObjects("*")],
        actions: ["s3:GetObject"],
      })
    );

    const siteDistribution = new awsCloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new s3Deployment.BucketDeployment(this, "SiteBucketDeployment", {
      destinationBucket: siteBucket,
      sources: [s3Deployment.Source.asset("dist")],
      distribution: siteDistribution,
      distributionPaths: ["/*"],
    });
  }
}
