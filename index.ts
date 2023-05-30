import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cdkCore from "@aws-cdk/core";

import { Construct, Stack } from "@aws-cdk/core";

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const siteBucket = new s3.Bucket(this, "Bucket", {
      bucketName: "annabusko-task2",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdkCore.RemovalPolicy.DESTROY,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, "OriginAccessIdentity");

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "Distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: originAccessIdentity,
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

    new s3deploy.BucketDeployment(this, "BucketDeployment", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}

class MyStaticSiteStack extends Stack {
  constructor(parent: cdkCore.App, name: string, props: cdkCore.StackProps) {
    super(parent, name, props);
    new StaticSite(this, "StaticSite");
  }
}
const app = new cdkCore.App();

new MyStaticSiteStack(app, "StaticSite", {
  env: {
    account: '471176946492',
    region: 'us-east-2'
  }
});

app.synth();