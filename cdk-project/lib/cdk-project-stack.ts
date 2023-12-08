import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new s3.Bucket(this, "myshop-app-bucket2", {
      bucketName: "myshop-app-bucket2",
    });
    const originAccessIdentity = new cf.OriginAccessIdentity(
      this,
      "MyShopAppOAI",
      {
        comment: myBucket.bucketName,
      }
    );
    myBucket.grantRead(originAccessIdentity);
    const cloudFront = new cf.Distribution(this, "MyShopAppDistribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(myBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });
    new deployment.BucketDeployment(this, "myShopAppDeploy", {
      destinationBucket: myBucket,
      sources: [deployment.Source.asset("../dist")],
      distribution: cloudFront,
      distributionPaths: ["/*"],
    });
    new cdk.CfnOutput(this, "Domain URL", {
      value: cloudFront.distributionDomainName,
    });
  }
}
