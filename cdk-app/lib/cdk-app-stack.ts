import * as cdk from "aws-cdk-lib";
import {
  aws_s3,
  aws_s3_deployment,
  aws_iam,
  aws_cloudfront,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a new bucket
    const bucket = new aws_s3.Bucket(this, "MyNewTask2Bucket", {
      bucketName: "my-newtask2-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      websiteIndexDocument: "index.html",
    });

    // create policy for bucket
    const OAI = new aws_cloudfront.OriginAccessIdentity(this, "MyNewTask2OAI", {
      comment: "MyNewTask2OAI",
    });

    // add policy
    bucket.addToResourcePolicy(
      new aws_iam.PolicyStatement({
        resources: [bucket.bucketArn],
        actions: ["s3:GetObject"],
        principals: [
          new cdk.aws_iam.CanonicalUserPrincipal(
            OAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    );
  }
}
