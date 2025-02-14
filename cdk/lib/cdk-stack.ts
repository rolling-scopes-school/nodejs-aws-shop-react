import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from "aws-cdk-lib";

const DIST_DIR_LOCATION: string = "../dist";

export class WebsiteStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html",
        });

        cdk.Tags.of(websiteBucket).add(
            "Description",
            "Bucket for RsSchool static website"
        );

        const distribution = new cloudfront.Distribution(this, "Distribution", {
            defaultBehavior: {
                origin: new origins.S3StaticWebsiteOrigin(websiteBucket),
                viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
            },
            defaultRootObject: "index.html",
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                },
            ],
            comment: "CloudFront distribution for RsSchool static website",
        });

        cdk.Tags.of(distribution).add(
            "Description",
            "Distribution for RsSchool static website"
        );

        new s3deploy.BucketDeployment(this, "WebsiteDeployment", {
            sources: [s3deploy.Source.asset(DIST_DIR_LOCATION)],
            destinationBucket: websiteBucket,
            distribution: distribution,
            distributionPaths: ["/*"],
        });

        new cdk.CfnOutput(this, "DistributionDomainName", {
            value: distribution.distributionDomainName,
            description: "CloudFront distribution URL",
        });

        new cdk.CfnOutput(this, "S3BucketURL", {
            value: websiteBucket.bucketWebsiteUrl,
            description: "S3 Bucket Website URL (Access restricted)",
        });
    }
}
