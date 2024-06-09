import {
  aws_s3,
  aws_s3_deployment,
  aws_iam,
  aws_cloudfront,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create a new bucket
    const bucket = new aws_s3.Bucket(this, "MyNewTask2Bucket", {
      bucketName: "my-newtask2-bucket",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      websiteIndexDocument: "index.html",
    });

    // create OAI
    const OAI = new aws_cloudfront.OriginAccessIdentity(this, "MyNewTask2OAI", {
      comment: "MyNewTask2OAI",
    });

    // add policy
    bucket.addToResourcePolicy(
      new aws_iam.PolicyStatement({
        resources: [bucket.bucketArn],
        actions: ["s3:GetObject"],
        principals: [
          new aws_iam.CanonicalUserPrincipal(
            OAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // create CloudFront distribution
    const distribution = new aws_cloudfront.CloudFrontWebDistribution(
      this,
      "CloudFrontDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: OAI,
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

    // deploy
    new aws_s3_deployment.BucketDeployment(this, "MyDeployment", {
      sources: [aws_s3_deployment.Source.asset("../dist")],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    });
  }
}
