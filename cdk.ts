/* eslint-disable prettier/prettier */
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cloudFront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";

const app = new cdk.App();

const stack = new cdk.Stack(app, "MyNewShop", {
    env: { region: "us-east-1" },
});

const bucket = new s3.Bucket(stack, "MyShopBucket", {
    bucketName: "new-my-shop-bucket",
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
    publicReadAccess: true,
});

const originAccessIdentity = new cloudFront.OriginAccessIdentity(
    stack,
    "MyShopBucketOAI",
    {
        comment: bucket.bucketName,
    }
);

bucket.grantRead(originAccessIdentity);

const cf = new cloudFront.Distribution(stack, "MyShopDistribution", {
    defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
            originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    defaultRootObject: "index.html",
    errorResponses: [
        {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
        },
    ],
});

new deployment.BucketDeployment(stack, "DeployMyShop", {
    destinationBucket: bucket,
    sources: [deployment.Source.asset("./dist")],
    distribution: cf,
    distributionPaths: ["/*"],
});

new cdk.CfnOutput(stack, "Domain URL", {
    value: cf.distributionDomainName,
});

const cloudFrontAwsResource = new AwsCustomResource(
    stack,
    `CloudFrontInvalidation-${Date.now()}`,
    {
        onCreate: {
            physicalResourceId: PhysicalResourceId.of(`E19H8X950QIIMN-${Date.now()}`),
            service: "CloudFront",
            action: "createInvalidation",
            parameters: {
                DistributionId: 'E19H8X950QIIMN',
                InvalidationBatch: {
                    CallerReference: Date.now().toString(),
                    Paths: {
                        Quantity: 1,
                        Items: ['/*']
                    }
                }
            },
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
            resources: AwsCustomResourcePolicy.ANY_RESOURCE
        }),
    }
);

cloudFrontAwsResource.node.addDependency(cf);