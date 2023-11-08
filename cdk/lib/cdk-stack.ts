import { Stack } from "aws-cdk-lib"
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront"
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam"
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3"
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from "constructs"

export class StaticWebsite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name)

    const cloudFrontOAI = new OriginAccessIdentity(this, "JSCC-OAI")

    const siteBucket = new Bucket(this, "JSCCStaticBucket", {
      bucketName: "react-shop-aws-cdk",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    })

    siteBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    )

    const distribution = new CloudFrontWebDistribution(
      this,
      "JSCC-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    )

    new BucketDeployment(this, "JSCC-Bucket-Deployment", {
      sources: [Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    })
  }
}
