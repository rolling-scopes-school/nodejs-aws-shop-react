import * as cdk from "aws-cdk-lib";
import {aws_cloudfront, aws_s3 as s3, aws_s3_deployment, RemovalPolicy, Stack} from "aws-cdk-lib";
// import {Site} from "./site";
import {Construct} from "constructs";
import {S3BucketOrigin} from "aws-cdk-lib/aws-cloudfront-origins";
import {AccessLevel} from "aws-cdk-lib/aws-cloudfront";

export class CdkAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id,  props);

        const bucket = new s3.Bucket(this, "SiteBucket", {
            removalPolicy: RemovalPolicy.DESTROY,
      //      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            versioned: false,
            autoDeleteObjects: true
        });



        const s3_origin = S3BucketOrigin.withOriginAccessControl(bucket,{
            originAccessLevels: [aws_cloudfront.AccessLevel.READ, AccessLevel.WRITE, AccessLevel.DELETE]
        });

        new aws_s3_deployment.BucketDeployment(this, "DeploySite", {
            sources: [aws_s3_deployment.Source.asset("./dist")],
            destinationBucket: bucket,
        });

       new aws_cloudfront.Distribution(this, "SiteDistribution", {
            defaultBehavior: {
                origin: s3_origin
            },
            defaultRootObject: "index.html"
        });
    }
}

