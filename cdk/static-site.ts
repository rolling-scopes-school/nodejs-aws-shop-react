#!/usr/bin/env node
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { Construct, Stack } from '@aws-cdk/core';

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "TKStaticReactSite");

    const bucket = new s3.Bucket(this, 'TKStaticReactSite', {
      bucketName: "tk-react-cloudfront-s3",
      websiteIndexDocument: "index.html",
      publicReadAccess: true
    });

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions:["S3:GetObject"],
      resources:[bucket.arnForObjects("*")],
      principals:[new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const distribution = new cloudfront.CloudFrontWebDistribution(this,"TKStaticReactSite", {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: cloudfrontOAI
        },
        behaviors: [
          {
            isDefaultBehavior:true
          }
        ]
      }]
    })

    new s3deploy.BucketDeployment(this, "TKStaticReactSite", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*']
    })
    
  }
}
