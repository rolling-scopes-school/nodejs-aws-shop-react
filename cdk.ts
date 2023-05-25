import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";

const app = new cdk.App();
const stack = new cdk.Stack(app, "MyShopCloudfrontStack");
const bucket = new s3.Bucket(stack, "MyShopAutoDeployBucket", {
  bucketName: "rss-my-shop-auto-deploy",
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  websiteIndexDocument: "index.html",
  publicReadAccess: false,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});
const originAccessIdentity = new cf.OriginAccessIdentity(
  stack,
  "MyShopAutoDeployBucketOAI",
  {
    comment: bucket.bucketName,
  }
);

bucket.grantRead(originAccessIdentity);

const cloudFrontWebDistribution = new cf.CloudFrontWebDistribution(
  stack,
  "MyShopAutoDistribution",
  {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: originAccessIdentity,
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

new deployment.BucketDeployment(stack, "MyShopAutoDeployment", {
  destinationBucket: bucket,
  sources: [deployment.Source.asset("./dist")],
  distribution: cloudFrontWebDistribution,
  distributionPaths: ["/*"],
});

new cdk.CfnOutput(stack, "S3bucket Url", {
  value: bucket.bucketWebsiteUrl,
});

new cdk.CfnOutput(stack, "Cloudfront Url", {
  value: cloudFrontWebDistribution.distributionDomainName,
});
