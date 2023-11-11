#!/usr/bin/env node
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

export class HttpOnlySite extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Content bucket
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // 
    });

    // CloudFront distribution that only serves HTTP
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL, // 
      },
      
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeploySiteContents', {
      sources: [s3deploy.Source.asset('./path-to-your-website-files')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}



// #!/usr/bin/env node
// import * as s3 from 'aws-cdk-lib/aws-s3';

// import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
// import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
// import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
// import { CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import { Construct } from 'constructs';

// import { join as pathJoin } from 'path';

// export interface StaticSiteProps {
//   domainName: string;
//   siteSubDomain: string;
// }

// /**
//  * Static site infrastructure, which deploys site content to an S3 bucket.
//  * cdk bootstrap aws://761576343621/eu-central-1  --profile=polska_cli_ubuntu
//  * The site redirects from HTTP to HTTPS, using a CloudFront distribution.
//  * Note: This version does not use a TLS certificate and will not serve content over HTTPS.
//  */
// export class StaticSite extends Construct {
//   constructor(parent: Stack, name: string, props: StaticSiteProps) {
//     super(parent, name);

//     // const siteDomain = props.siteSubDomain + '.' + props.domainName;
//     const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfront-OAI', {
//       comment: `OAI for ${name}`
//     });

//     // new CfnOutput(this, 'Site', { value: 'http://' + siteDomain });

//     // Content bucket
//     const siteBucket = new s3.Bucket(this, 'SiteBucket', {
//       // bucketName: siteDomain,
//       publicReadAccess: false,
//       blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
//       removalPolicy: RemovalPolicy.DESTROY,
//       autoDeleteObjects: true,
//     });

//     siteBucket.addToResourcePolicy(new iam.PolicyStatement({
//       actions: ['s3:GetObject'],
//       resources: [siteBucket.arnForObjects('*')],
//       principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
//     }));
//     new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

//     // CloudFront distribution
//     const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
//       defaultRootObject: "index.html",
//       domainNames: ["siteDomain99988822"],
//       minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021, // Note: You might need to change this if not using HTTPS
//       errorResponses:[
//         {
//           httpStatus: 403,
//           responseHttpStatus: 403,
//           responsePagePath: '/error.html',
//           ttl: Duration.minutes(30),
//         }
//       ],
//       defaultBehavior: {
//         origin: new cloudfront_origins.S3Origin(siteBucket, {originAccessIdentity: cloudfrontOAI}),
//         compress: true,
//         allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
//         viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL, // Allow both HTTP and HTTPS
//       }
//     });

//     new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

//     // Deploy site contents to S3 bucket
//     new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
//       sources: [s3deploy.Source.asset(pathJoin(__dirname, './site-contents'))],
//       destinationBucket: siteBucket,
//       distribution,
//       distributionPaths: ['/*'],
//     });
//   }
// }
