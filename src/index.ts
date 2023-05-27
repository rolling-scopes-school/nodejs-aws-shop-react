import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import * as cloudFront from "@aws-cdk/aws-cloudfront";
import * as deploy from "@aws-cdk/aws-s3-deployment";

const APP_PREFIX = "bw-nodejs-aws-shop-react";

const app = new cdk.App();

const stack = new cdk.Stack(app, `${APP_PREFIX}-stack`, {
  description: `This stack includes resources needed to deploy ${APP_PREFIX} application`,
});

const bucket = new s3.Bucket(stack, `${APP_PREFIX}-bucket`, {
  bucketName: "bw-nodejs-aws-shop-react-cdk",
  websiteIndexDocument: "index.html",
  publicReadAccess: false,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

const oai = new cloudFront.OriginAccessIdentity(stack, `${APP_PREFIX}-oai`);

bucket.addToResourcePolicy(
  new iam.PolicyStatement({
    actions: ["s3:GetObject"],
    resources: [bucket.arnForObjects("*")],
    principals: [
      new iam.CanonicalUserPrincipal(
        oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
      ),
    ],
  })
);

const distribution = new cloudFront.CloudFrontWebDistribution(
  stack,
  `${APP_PREFIX}-distribution`,
  {
    comment: `${APP_PREFIX} distribution`,
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: oai,
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

new deploy.BucketDeployment(stack, `${APP_PREFIX}-deployment`, {
  sources: [deploy.Source.asset("./dist")],
  destinationBucket: bucket,
  distribution,
  distributionPaths: ["/index.html", "/assets/*"],
});

app.synth();
