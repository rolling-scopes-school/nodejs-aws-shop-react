import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

import * as cloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudFrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';

import type { Construct } from 'constructs';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ID = 'rs-school-aws-shop-yan-litvinenko';

    const rsSchoolAWSShopYanLitvinenko = new s3.Bucket(this, `${ID}-s3.Bucket`, {
      websiteErrorDocument: 'index.html',         
      websiteIndexDocument: 'index.html',          
      publicReadAccess: false,                    
      removalPolicy: cdk.RemovalPolicy.DESTROY,    
      autoDeleteObjects: true,                     
      bucketName: ID,                           
      blockPublicAccess: new s3.BlockPublicAccess({    
        blockPublicAcls: true,                        
        blockPublicPolicy: true,                      
        ignorePublicAcls: true,                        
        restrictPublicBuckets: true                  
      })
    });

    const originAccessIdentity = new cloudFront.OriginAccessIdentity(this, `${ID}-cloudFront.OAI`);
    rsSchoolAWSShopYanLitvinenko.grantRead(originAccessIdentity);

    const distribution = new cloudFront.Distribution(this, `${ID}-cloudFront.Distribution`, {
      defaultBehavior: {
        origin: new cloudFrontOrigins.S3Origin(rsSchoolAWSShopYanLitvinenko, {
          originAccessIdentity: undefined
        }),
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudFront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudFront.CachedMethods.CACHE_GET_HEAD
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    new s3deploy.BucketDeployment(this, `${ID}-s3deploy.BucketDeployment`, {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: rsSchoolAWSShopYanLitvinenko,
      distribution,
      distributionPaths: ['/*']
    });

    new cdk.CfnOutput(this, `${ID}-website-URL-s3`, {
      value: rsSchoolAWSShopYanLitvinenko.bucketWebsiteUrl
    })

    new cdk.CfnOutput(this, `${ID}-website-URL-cloudFront`, {
      value: distribution.domainName
   })
  }
}
