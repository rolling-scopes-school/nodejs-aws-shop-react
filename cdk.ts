import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";

const app = new cdk.App();

const prefix = "rs-aws-shop-react";

const stack = new cdk.Stack(app, `${prefix}-stack`, {
    description: `This stack includes resources needed to deploy ${prefix} application`,
});

const bucket = new s3.Bucket(stack, `${prefix}-bucket`, {
    bucketName: "liaukou-rs-aws-shop-react-cdk",
    websiteIndexDocument: "index.html",
    publicReadAccess: false,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

const originAccessIdentity = new cf.OriginAccessIdentity(stack, `${prefix}-oai`);

bucket.grantRead(originAccessIdentity);

const cloudFront = new cf.CloudFrontWebDistribution(stack, `${prefix}-cf`, {
    originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: bucket,
                originAccessIdentity,
            },
            behaviors: [
                {
                    isDefaultBehavior: true,
                },
            ],
        },
    ],
    defaultRootObject: 'index.html',
});

new deployment.BucketDeployment(stack, `${prefix}-deployment`, {
    destinationBucket: bucket,
    sources: [
        deployment.Source.asset('./dist')
    ],
    distribution: cloudFront,
    distributionPaths: ['/*']
});

new cdk.CfnOutput(stack, 'Domain URL', {
    value: cloudFront.distributionDomainName
});

app.synth();
