import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";
import { stack } from "./bin/cdk";

const BUCKET_ID = "RssShopSpaBucket";
const BUCKET_NAME = "rss-shop-spa-bucket";
const ORIGIN_ACCESS_IDENTITY_ID = "RssShopSpaOai";
const CLOUD_FRONT_WEB_DISTRIBUTION_ID = "RssShopSpaCfDistribution";
const BUCKET_DEPLOYMENT_ID = "RssShopSpaBucketDeployment";

const bucket = new s3.Bucket(stack, BUCKET_ID, {
  bucketName: BUCKET_NAME,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: "index.html",
  autoDeleteObjects: true,
  publicReadAccess: false,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});
const originAccessIdentity = new cf.OriginAccessIdentity(
  stack,
  ORIGIN_ACCESS_IDENTITY_ID
);
const cloudFrontWebDistribution = new cf.CloudFrontWebDistribution(
  stack,
  CLOUD_FRONT_WEB_DISTRIBUTION_ID,
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
    viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    defaultRootObject: "index.html",
    errorConfigurations: [
      {
        errorCode: 404,
        responseCode: 200,
        responsePagePath: "/index.html",
      },
    ],
  }
);

bucket.grantRead(originAccessIdentity);
new deployment.BucketDeployment(stack, BUCKET_DEPLOYMENT_ID, {
  destinationBucket: bucket,
  sources: [deployment.Source.asset("./dist")],
  distribution: cloudFrontWebDistribution,
  distributionPaths: ["/*"],
});

new cdk.CfnOutput(stack, "BucketUrl", {
  value: bucket.bucketWebsiteUrl,
});
new cdk.CfnOutput(stack, "CloudfrontUrl", {
  value: cloudFrontWebDistribution.distributionDomainName,
});
