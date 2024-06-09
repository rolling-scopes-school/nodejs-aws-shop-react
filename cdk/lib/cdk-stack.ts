import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = 'rss-shop-react-bucket';

     const rssShopReactBucket = new s3.Bucket(this, 'RssShopReactBucket', {
        bucketName,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'WebsiteDistributionRssShopReact', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: rssShopReactBucket,
            originAccessIdentity: originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              // forwardedValues: {
              //   headers: ['Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
              //   queryString: true,
              // },
            },
          ],
        },
      ],
    });

    rssShopReactBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${rssShopReactBucket.bucketArn}/*`],
      principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    // const deploymentRole = new iam.Role(this, 'DeploymentRoleShopReact', {
    //   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    // });
    //
    // deploymentRole.addToPolicy(new iam.PolicyStatement({
    //   actions: [
    //     's3:Abort*',
    //     's3:DeleteObject*',
    //     's3:GetBucket*',
    //     's3:GetObject*',
    //     's3:List*',
    //     's3:PutObject*',
    //     'cloudfront:CreateInvalidation',
    //     'cloudfront:GetInvalidation'
    //   ],
    //   resources: [
    //     ShopReactBucket.bucketArn,
    //     `${ShopReactBucket.bucketArn}/*`,
    //     '*'
    //   ],
    // }));

    new s3deploy.BucketDeployment(this, 'DeployRssShopReact', {
      sources: [s3deploy.Source.asset('./dist')],
      destinationBucket: rssShopReactBucket,
      distribution,
      distributionPaths: ['/*'],
      // role: deploymentRole,
      retainOnDelete: true,
    });

    new cdk.CfnOutput(this, 'CloudFrontRssShopReact', {
      value: distribution.distributionDomainName,
      description: 'The CloudFront distribution RssShopReact',
    });

    new cdk.CfnOutput(this, 'S3WebsiteURL', {
      value: rssShopReactBucket.bucketWebsiteUrl,
      description: 'The URL of the S3 bucket static website',
    });
  }
}
