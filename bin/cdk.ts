import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as cloudfrontOrigins from "@aws-cdk/aws-cloudfront-origins";

const app = new cdk.App();
const stack = new cdk.Stack(app, "RsAwsCdkStack", {
  env: {
    region: "eu-west-1",
  },
});
const bucket = new s3.Bucket(stack, "RsAwsCdkBucket", {
  bucketName: "rs-aws-cdk-bucket",
});
const originAccessIdentity = new cloudfront.OriginAccessIdentity(
  stack,
  "RsAwsCdkOAI",
  {
    comment: bucket.bucketName,
  }
);
bucket.grantRead(originAccessIdentity);
const clodFront = new cloudfront.Distribution(stack, "RsAwsCdkDistribution", {
  defaultBehavior: {
    origin: new cloudfrontOrigins.S3Origin(bucket, {
      originAccessIdentity: originAccessIdentity,
    }),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  defaultRootObject: "index.html",
  errorResponses: [
    {
      httpStatus: 404,
      responseHttpStatus: 200,
      responsePagePath: "/index.html",
    },
  ],
});

new s3deploy.BucketDeployment(stack, "RsAwsCdkBucketDeployment", {
  destinationBucket: bucket,
  sources: [s3deploy.Source.asset("./dist")],
  distribution: clodFront,
  distributionPaths: ["/*"],
});

new cdk.CfnOutput(stack, "RsAwsDomainUrl", {
  value: clodFront.distributionDomainName,
});

new cdk.CfnOutput(stack, "bucketUrl", {
  value: bucket.bucketWebsiteUrl,
  exportName: "ShopStaticSiteServeBucketURL",
});
