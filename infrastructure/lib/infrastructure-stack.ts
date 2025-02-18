import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";
import {BlockPublicAccess} from "aws-cdk-lib/aws-s3";
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';


export class InfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);


        const bucket = new s3.Bucket(this, 'S3Bucket', {
            bucketName: 'nodejs-aws-shop-react-assets-automated',
            versioned: true,
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteIndexDocument: 'index.html',
        });

        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'CloudFrontOAI');
        bucket.grantRead(originAccessIdentity); // Allow CloudFront to read from S3


        const distribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(bucket, {
                    originAccessIdentity: originAccessIdentity, // Use OAC for secure access
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            defaultRootObject: 'index.html',
        });


        new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset('../dist')], // Ensure your build output folder is correct
            destinationBucket: bucket,
            distribution,
            distributionPaths: ['/*'], // Ensure cache is invalidated
        });


        new cdk.CfnOutput(this, 'CloudFrontURL', {
            value: distribution.domainName,
        });
    }
}