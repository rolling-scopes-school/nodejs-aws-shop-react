import { App, Stack, CfnOutput } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  OriginAccessIdentity,
  Distribution,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";

import {
  STACK_NAME,
  BUCKET_NAME,
  DEFAULT_REGION,
  BUILD_FOLDER_PATH,
  BUCKET_ID,
  ORIGIN_AI_ID,
  DISTRIBUTION_ID,
  BUCKET_DEPLOYMENT_ID,
  CFN_OUTPUT_ID,
} from "./constants.js";

const app = new App();
const stack = new Stack(app, STACK_NAME, { env: { region: DEFAULT_REGION } });
const bucket = new Bucket(stack, BUCKET_ID, { bucketName: BUCKET_NAME });

const originAccessIdentity = new OriginAccessIdentity(stack, ORIGIN_AI_ID, {
  comment: bucket.bucketName,
});

bucket.grantRead(originAccessIdentity);

const cloudfront = new Distribution(stack, DISTRIBUTION_ID, {
  defaultBehavior: {
    origin: new S3Origin(bucket, { originAccessIdentity }),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
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

new BucketDeployment(stack, BUCKET_DEPLOYMENT_ID, {
  destinationBucket: bucket,
  sources: [Source.asset(BUILD_FOLDER_PATH)],
  distribution: cloudfront,
  distributionPaths: ["/*"],
});

new CfnOutput(stack, CFN_OUTPUT_ID, {
  value: cloudfront.distributionDomainName,
});
