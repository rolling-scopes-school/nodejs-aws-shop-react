import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";

import { bucketName } from '../constants';

export class CdkDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
      const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
        bucketName,
        websiteIndexDocument: 'index.html',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      });

      const originAccessIdentity = new cf.OriginAccessIdentity(
        this,
        "WebAppBucketOAI",
        {
          comment: websiteBucket.bucketName,
        }
      );

      websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions:["S3:GetObject"],
        resources:[websiteBucket.arnForObjects("*")],
        principals:[new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
      }))

      const cloudfront = new cf.CloudFrontWebDistribution(
        this,
        "WebAppDistribution",
        {
          originConfigs: [
            {
              s3OriginSource: {
                s3BucketSource: websiteBucket,
                originAccessIdentity: originAccessIdentity
              },
              behaviors: [{ isDefaultBehavior: true }],
            },
          ],
        }
      );
  
      new s3deploy.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3deploy.Source.asset("../dist")],
        destinationBucket: websiteBucket,
        distribution: cloudfront,
        distributionPaths: ["/*"],
      });
  
      new cdk.CfnOutput(this, "DomainURL", {
        value: cloudfront.distributionDomainName,
      });
  }
}