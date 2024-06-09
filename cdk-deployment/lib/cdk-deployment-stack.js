#!/usr/bin/env node

const { Stack } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const iam = require('aws-cdk-lib/aws-iam');
const s3Deployment = require('aws-cdk-lib/aws-s3-deployment');
const cloudFront = require('aws-cdk-lib/aws-cloudfront');

class CdkDeploymentStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const cloudfrontOAI = new cloudFront.OriginAccessIdentity(this, 'rs-aws-cloud-developer-task-2-OAI');

    const siteBucket = new s3.Bucket(this, 'rs-aws-cloud-developer-task-2-sa', {
      bucketName: 'rs-aws-cloud-developer-task-2-sa-s3',
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('*')],
        principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      }),
    );

    const distribution = new cloudFront.CloudFrontWebDistribution(this, 'rs-aws-cloud-developer-task-2-cloudfront-distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudfrontOAI,
        },
        behaviors: [{ 
          isDefaultBehavior: true 
        }],
      }],
    });

    new s3Deployment.BucketDeployment(this, 'rs-aws-cloud-developer-task-2-bucket-deployment', {
      sources: [s3Deployment.Source.asset('../dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}

module.exports = { CdkDeploymentStack }
