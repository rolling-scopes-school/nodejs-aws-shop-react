import { App, Stack, CfnOutput } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  OriginAccessIdentity,
  CloudFrontWebDistribution,
} from "aws-cdk-lib/aws-cloudfront";

import {
  STACK_NAME,
  BUCKET_NAME,
  DEFAULT_REGION,
  BUILD_FOLDER_PATH,
  STACK_ID,
  BUCKET_ID,
  ORIGIN_AI_ID,
  DISTRIBUTION_ID,
  BUCKET_DEPLOYMENT_ID,
  CFN_OUTPUT_ID,
  ENTRY_POINT,
} from "./constants.js";

const app = new App();
const stack = new Stack(app, STACK_ID, {
  stackName: STACK_NAME,
  env: { region: DEFAULT_REGION },
  description:
    "The main Cloud Formation Stack to manage all resources of the Shop application",
});

const originAccessIdentity = new OriginAccessIdentity(stack, ORIGIN_AI_ID, {
  comment: `Allows CloudFront to reach the bucket - ${BUCKET_NAME}`,
});

const bucket = new Bucket(stack, BUCKET_ID, {
  bucketName: BUCKET_NAME,
  websiteIndexDocument: ENTRY_POINT,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
});

const distribution = new CloudFrontWebDistribution(stack, DISTRIBUTION_ID, {
  comment: "Cloud Front Distribution for deploy Shop App",
  defaultRootObject: ENTRY_POINT,
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: bucket,
        originAccessIdentity,
      },
      behaviors: [
        {
          isDefaultBehavior: true,
        },
      ],
    },
  ],
});

new BucketDeployment(stack, BUCKET_DEPLOYMENT_ID, {
  destinationBucket: bucket,
  sources: [Source.asset(BUILD_FOLDER_PATH)],
  distribution,
  distributionPaths: ["/*"],
});

new CfnOutput(stack, CFN_OUTPUT_ID, {
  description: "Cloud Front Deploy URL",
  value: distribution.distributionDomainName,
});
