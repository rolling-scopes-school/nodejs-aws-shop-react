import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

import * as cloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudFrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';

import type { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ID = 'rs-school-aws-shop-yan-litvinenko';

    const rsSchoolAWSShopYanLitvinenko = new s3.Bucket(this, `${ID}-s3.Bucket`, {
      websiteErrorDocument: 'index.html',
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: ID,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      })
    });

    new s3deploy.BucketDeployment(this, `${ID}-s3deploy.BucketDeployment`, {
			sources: [s3deploy.Source.asset("../dist")],
			destinationBucket: rsSchoolAWSShopYanLitvinenko
		})

    new cdk.CfnOutput(this, `${ID}-website-URL`, {
      value: rsSchoolAWSShopYanLitvinenko.bucketWebsiteUrl
    })

    const distribution = new cloudFront.Distribution(this, `${ID}-cloudFront.Distribution`, {
      defaultBehavior: {
        origin: new cloudFrontOrigins.S3Origin(rsSchoolAWSShopYanLitvinenko),
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    new s3deploy.BucketDeployment(this, `${ID}-s3deploy.BucketDeployment-2`, {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: rsSchoolAWSShopYanLitvinenko,
      distribution,
      distributionPaths: ['/*']
    });

    new cdk.CfnOutput(this, `${ID}-cloudFront.CfnOutput`, {
      value: distribution.distributionDomainName
    });
  }
}

