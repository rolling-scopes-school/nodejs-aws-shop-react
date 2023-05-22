import { RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as S3 from "aws-cdk-lib/aws-s3";
import * as S3Deploy from "aws-cdk-lib/aws-s3-deployment";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import { join } from "path";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new S3.Bucket(this, "MyFirstBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: S3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    const accessDeniedErrorResponse: cloudfront.CfnDistribution.CustomErrorResponseProperty =
      {
        errorCode: 403,
        errorCachingMinTtl: 30,
        responseCode: 200,
        responsePagePath: "/index.html",
      };
    const notFoundErrorResponse: cloudfront.CfnDistribution.CustomErrorResponseProperty =
      {
        errorCode: 404,
        errorCachingMinTtl: 30,
        responseCode: 200,
        responsePagePath: "/index.html",
      };

    const oai = new OriginAccessIdentity(this, `origin-access-id`, {});
    bucket.grantRead(oai);

    const distribution = new CloudFrontWebDistribution(
      this,
      `MyFirstDistribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [accessDeniedErrorResponse, notFoundErrorResponse],
      }
    );

    new S3Deploy.BucketDeployment(this, "MyFirstDeploy", {
      sources: [
        S3Deploy.Source.asset(join(__dirname, "..", "..", "..", "dist")),
      ],
      destinationBucket: bucket,
    });

    new CfnOutput(this, "BucketUrl", {
      value: bucket.bucketWebsiteUrl,
      exportName: "FrontendBucketUrl",
    });

    new CfnOutput(this, "DistributionUrl", {
      value: distribution.distributionDomainName,
      exportName: "FrontendUrl",
    });
  }
}
