#!/usr/bin/env node
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CfnOutput, RemovalPolicy, Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import path = require('path');

export class AwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'RSFrontOAI', {
      comment: `OAI for rs-aws-front-cdn`
    });

    const bucket = new s3.Bucket(this, 'RsFrontBucket', {
      bucketName: "rs-aws-front-cdn",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
    });

    Tags.of(bucket).add('project', 'rs-front');
    Tags.of(bucket).add('version', '1');
    Tags.of(bucket).add('environment', 'dev');
    Tags.of(bucket).add('type_deploy', 'cdn');

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    new CfnOutput(this, 'Bucket Name', { value: bucket.bucketName });
    new CfnOutput(this, 'Bucket Website Url', { value: bucket.bucketWebsiteUrl });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, "RSFrontCloudFrontWebDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudfrontOAI,
          },
          behaviors: [{isDefaultBehavior: true}],
        },
      ],
    });

    new CfnOutput(this, 'Distribution Id', { value: distribution.distributionId });
    new CfnOutput(this, 'Distribution link', { value: distribution.distributionDomainName });

    new s3deploy.BucketDeployment(this, 'RSFrontDeployWithInvalidation', {
      sources: [s3deploy.Source.asset(path.join('../dist'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

  }
}
