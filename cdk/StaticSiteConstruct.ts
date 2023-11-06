import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cloudFront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";

import { Construct } from "constructs";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";

export class StaticSiteConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, "StaticSiteBucket", {
      bucketName: "rs-aws-static-site",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const originAccessControl = new cloudFront.CfnOriginAccessControl(
      this,
      "OriginAccessControl",
      {
        originAccessControlConfig: {
          name: "rs-aws-static-site-origin-access-protocol",
          originAccessControlOriginType: "s3",
          signingProtocol: "sigv4",
          signingBehavior: "always"
        }
      }
    );

    const distribution = new cloudFront.CloudFrontWebDistribution(
      this,
      "CloudFrontDistribution",
      {
        defaultRootObject: "index.html",
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.HTTPS_ONLY,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    // workaround to use Origin Access Control instead of legacy Origin Access Identity
    const cfnDistribution = distribution.node.defaultChild as cloudFront.CfnDistribution;
    cfnDistribution.addPropertyOverride("DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity", "");
    cfnDistribution.addPropertyOverride("DistributionConfig.Origins.0.OriginAccessControlId", originAccessControl.getAtt("Id"));

    // workaround to use Cache Policy instead of legacy Cache Behavior
    cfnDistribution.addPropertyDeletionOverride("DistributionConfig.DefaultCacheBehavior.AllowedMethods");
    cfnDistribution.addPropertyDeletionOverride("DistributionConfig.DefaultCacheBehavior.CachedMethods");
    cfnDistribution.addPropertyDeletionOverride("DistributionConfig.DefaultCacheBehavior.ForwardedValues");
    cfnDistribution.addPropertyOverride("DistributionConfig.DefaultCacheBehavior.CachePolicyId", cloudFront.CachePolicy.CACHING_OPTIMIZED.cachePolicyId);
        
    const distributionArn = `arn:aws:cloudfront::${distribution.stack.account}:distribution/${distribution.distributionId}`

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": distributionArn
          }
        }
      })
    ); 

    const deployment = new s3Deployment.BucketDeployment(this, "StaticSiteDeployment", {
      sources: [s3Deployment.Source.asset("./dist")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // define policies how to handle resources in case of stack destruction
    distribution.applyRemovalPolicy(RemovalPolicy.DESTROY);
    originAccessControl.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new CfnOutput(this, "S3BucketUrl", {
      value: bucket.bucketWebsiteUrl,
    })

    new CfnOutput(this, "CloudFrontUrl", {
      value: distribution.distributionDomainName,
    })
  }
}
