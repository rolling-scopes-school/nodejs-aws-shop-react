#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpOnlySite = void 0;
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const cloudfront_origins = require("aws-cdk-lib/aws-cloudfront-origins");
const constructs_1 = require("constructs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class HttpOnlySite extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // NOT recommended for production code
        });
        // CloudFront distribution that only serves HTTP
        const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
            defaultRootObject: "index.html",
            defaultBehavior: {
                origin: new cloudfront_origins.S3Origin(siteBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL, // Allows both HTTP and HTTPS
            },
            // Note: By default, CloudFront distributions are HTTPS-enabled
            // The ViewerProtocolPolicy.ALLOW_ALL setting allows HTTP access
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
exports.HttpOnlySite = HttpOnlySite;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EseUNBQXlDO0FBQ3pDLHlEQUF5RDtBQUN6RCwwREFBMEQ7QUFDMUQseUVBQXlFO0FBQ3pFLDJDQUF1QztBQUN2Qyw2Q0FBNEM7QUFFNUMsTUFBYSxZQUFhLFNBQVEsc0JBQVM7SUFDekMsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpQkFBaUI7UUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDbkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsc0NBQXNDO1NBQ2hFLENBQUMsQ0FBQztRQUVILGdEQUFnRDtRQUNoRCxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3pFLGlCQUFpQixFQUFFLFlBQVk7WUFDL0IsZUFBZSxFQUFFO2dCQUNmLE1BQU0sRUFBRSxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQ25ELG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCO2FBQy9GO1lBQ0QsK0RBQStEO1lBQy9ELGdFQUFnRTtTQUNqRSxDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3hELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDaEUsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixZQUFZO1lBQ1osaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBN0JELG9DQTZCQztBQUlELHNCQUFzQjtBQUN0Qiw0Q0FBNEM7QUFFNUMsNERBQTREO0FBQzVELDZEQUE2RDtBQUM3RCw0RUFBNEU7QUFDNUUsMkVBQTJFO0FBQzNFLDhDQUE4QztBQUM5QywwQ0FBMEM7QUFFMUMsMkNBQTJDO0FBRTNDLHFDQUFxQztBQUNyQyx3QkFBd0I7QUFDeEIsMkJBQTJCO0FBQzNCLElBQUk7QUFFSixNQUFNO0FBQ04sNkVBQTZFO0FBQzdFLGdGQUFnRjtBQUNoRiw2RUFBNkU7QUFDN0UsOEZBQThGO0FBQzlGLE1BQU07QUFDTiw4Q0FBOEM7QUFDOUMsdUVBQXVFO0FBQ3ZFLDJCQUEyQjtBQUUzQiwwRUFBMEU7QUFDMUUsMEZBQTBGO0FBQzFGLG1DQUFtQztBQUNuQyxVQUFVO0FBRVYseUVBQXlFO0FBRXpFLHdCQUF3QjtBQUN4Qiw2REFBNkQ7QUFDN0QsbUNBQW1DO0FBQ25DLGlDQUFpQztBQUNqQywyREFBMkQ7QUFDM0QsOENBQThDO0FBQzlDLGlDQUFpQztBQUNqQyxVQUFVO0FBRVYsK0RBQStEO0FBQy9ELG1DQUFtQztBQUNuQyxvREFBb0Q7QUFDcEQsb0hBQW9IO0FBQ3BILFdBQVc7QUFDWCx1RUFBdUU7QUFFdkUsaUNBQWlDO0FBQ2pDLG1GQUFtRjtBQUNuRix5Q0FBeUM7QUFDekMsNkNBQTZDO0FBQzdDLDJJQUEySTtBQUMzSSx5QkFBeUI7QUFDekIsWUFBWTtBQUNaLDZCQUE2QjtBQUM3QixxQ0FBcUM7QUFDckMsNkNBQTZDO0FBQzdDLHVDQUF1QztBQUN2QyxZQUFZO0FBQ1osV0FBVztBQUNYLDJCQUEyQjtBQUMzQixzR0FBc0c7QUFDdEcsMEJBQTBCO0FBQzFCLDRFQUE0RTtBQUM1RSx3R0FBd0c7QUFDeEcsVUFBVTtBQUNWLFVBQVU7QUFFVixxRkFBcUY7QUFFckYsMkNBQTJDO0FBQzNDLHNFQUFzRTtBQUN0RSxrRkFBa0Y7QUFDbEYsdUNBQXVDO0FBQ3ZDLHNCQUFzQjtBQUN0QixtQ0FBbUM7QUFDbkMsVUFBVTtBQUNWLE1BQU07QUFDTixJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQnO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udF9vcmlnaW5zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250LW9yaWdpbnMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuXG5leHBvcnQgY2xhc3MgSHR0cE9ubHlTaXRlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBDb250ZW50IGJ1Y2tldFxuICAgIGNvbnN0IHNpdGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdTaXRlQnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIE5PVCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiBjb2RlXG4gICAgfSk7XG5cbiAgICAvLyBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiB0aGF0IG9ubHkgc2VydmVzIEhUVFBcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24odGhpcywgJ1NpdGVEaXN0cmlidXRpb24nLCB7XG4gICAgICBkZWZhdWx0Um9vdE9iamVjdDogXCJpbmRleC5odG1sXCIsXG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHtcbiAgICAgICAgb3JpZ2luOiBuZXcgY2xvdWRmcm9udF9vcmlnaW5zLlMzT3JpZ2luKHNpdGVCdWNrZXQpLFxuICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5BTExPV19BTEwsIC8vIEFsbG93cyBib3RoIEhUVFAgYW5kIEhUVFBTXG4gICAgICB9LFxuICAgICAgLy8gTm90ZTogQnkgZGVmYXVsdCwgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25zIGFyZSBIVFRQUy1lbmFibGVkXG4gICAgICAvLyBUaGUgVmlld2VyUHJvdG9jb2xQb2xpY3kuQUxMT1dfQUxMIHNldHRpbmcgYWxsb3dzIEhUVFAgYWNjZXNzXG4gICAgfSk7XG5cbiAgICAvLyBEZXBsb3kgc2l0ZSBjb250ZW50cyB0byBTMyBidWNrZXRcbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95U2l0ZUNvbnRlbnRzJywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldCgnLi9wYXRoLXRvLXlvdXItd2Vic2l0ZS1maWxlcycpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBzaXRlQnVja2V0LFxuICAgICAgZGlzdHJpYnV0aW9uLFxuICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFsnLyonXSxcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLy8gaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcblxuLy8gaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udCc7XG4vLyBpbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG4vLyBpbXBvcnQgKiBhcyBjbG91ZGZyb250X29yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG4vLyBpbXBvcnQgeyBDZm5PdXRwdXQsIER1cmF0aW9uLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbi8vIGltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vLyBpbXBvcnQgeyBqb2luIGFzIHBhdGhKb2luIH0gZnJvbSAncGF0aCc7XG5cbi8vIGV4cG9ydCBpbnRlcmZhY2UgU3RhdGljU2l0ZVByb3BzIHtcbi8vICAgZG9tYWluTmFtZTogc3RyaW5nO1xuLy8gICBzaXRlU3ViRG9tYWluOiBzdHJpbmc7XG4vLyB9XG5cbi8vIC8qKlxuLy8gICogU3RhdGljIHNpdGUgaW5mcmFzdHJ1Y3R1cmUsIHdoaWNoIGRlcGxveXMgc2l0ZSBjb250ZW50IHRvIGFuIFMzIGJ1Y2tldC5cbi8vICAqIGNkayBib290c3RyYXAgYXdzOi8vNzYxNTc2MzQzNjIxL2V1LWNlbnRyYWwtMSAgLS1wcm9maWxlPXBvbHNrYV9jbGlfdWJ1bnR1XG4vLyAgKiBUaGUgc2l0ZSByZWRpcmVjdHMgZnJvbSBIVFRQIHRvIEhUVFBTLCB1c2luZyBhIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uLlxuLy8gICogTm90ZTogVGhpcyB2ZXJzaW9uIGRvZXMgbm90IHVzZSBhIFRMUyBjZXJ0aWZpY2F0ZSBhbmQgd2lsbCBub3Qgc2VydmUgY29udGVudCBvdmVyIEhUVFBTLlxuLy8gICovXG4vLyBleHBvcnQgY2xhc3MgU3RhdGljU2l0ZSBleHRlbmRzIENvbnN0cnVjdCB7XG4vLyAgIGNvbnN0cnVjdG9yKHBhcmVudDogU3RhY2ssIG5hbWU6IHN0cmluZywgcHJvcHM6IFN0YXRpY1NpdGVQcm9wcykge1xuLy8gICAgIHN1cGVyKHBhcmVudCwgbmFtZSk7XG5cbi8vICAgICAvLyBjb25zdCBzaXRlRG9tYWluID0gcHJvcHMuc2l0ZVN1YkRvbWFpbiArICcuJyArIHByb3BzLmRvbWFpbk5hbWU7XG4vLyAgICAgY29uc3QgY2xvdWRmcm9udE9BSSA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsICdjbG91ZGZyb250LU9BSScsIHtcbi8vICAgICAgIGNvbW1lbnQ6IGBPQUkgZm9yICR7bmFtZX1gXG4vLyAgICAgfSk7XG5cbi8vICAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdTaXRlJywgeyB2YWx1ZTogJ2h0dHA6Ly8nICsgc2l0ZURvbWFpbiB9KTtcblxuLy8gICAgIC8vIENvbnRlbnQgYnVja2V0XG4vLyAgICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NpdGVCdWNrZXQnLCB7XG4vLyAgICAgICAvLyBidWNrZXROYW1lOiBzaXRlRG9tYWluLFxuLy8gICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4vLyAgICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuLy8gICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuLy8gICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4vLyAgICAgfSk7XG5cbi8vICAgICBzaXRlQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuLy8gICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnXSxcbi8vICAgICAgIHJlc291cmNlczogW3NpdGVCdWNrZXQuYXJuRm9yT2JqZWN0cygnKicpXSxcbi8vICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkNhbm9uaWNhbFVzZXJQcmluY2lwYWwoY2xvdWRmcm9udE9BSS5jbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlTM0Nhbm9uaWNhbFVzZXJJZCldXG4vLyAgICAgfSkpO1xuLy8gICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0J1Y2tldCcsIHsgdmFsdWU6IHNpdGVCdWNrZXQuYnVja2V0TmFtZSB9KTtcblxuLy8gICAgIC8vIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uXG4vLyAgICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uKHRoaXMsICdTaXRlRGlzdHJpYnV0aW9uJywge1xuLy8gICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6IFwiaW5kZXguaHRtbFwiLFxuLy8gICAgICAgZG9tYWluTmFtZXM6IFtcInNpdGVEb21haW45OTk4ODgyMlwiXSxcbi8vICAgICAgIG1pbmltdW1Qcm90b2NvbFZlcnNpb246IGNsb3VkZnJvbnQuU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDIxLCAvLyBOb3RlOiBZb3UgbWlnaHQgbmVlZCB0byBjaGFuZ2UgdGhpcyBpZiBub3QgdXNpbmcgSFRUUFNcbi8vICAgICAgIGVycm9yUmVzcG9uc2VzOltcbi8vICAgICAgICAge1xuLy8gICAgICAgICAgIGh0dHBTdGF0dXM6IDQwMyxcbi8vICAgICAgICAgICByZXNwb25zZUh0dHBTdGF0dXM6IDQwMyxcbi8vICAgICAgICAgICByZXNwb25zZVBhZ2VQYXRoOiAnL2Vycm9yLmh0bWwnLFxuLy8gICAgICAgICAgIHR0bDogRHVyYXRpb24ubWludXRlcygzMCksXG4vLyAgICAgICAgIH1cbi8vICAgICAgIF0sXG4vLyAgICAgICBkZWZhdWx0QmVoYXZpb3I6IHtcbi8vICAgICAgICAgb3JpZ2luOiBuZXcgY2xvdWRmcm9udF9vcmlnaW5zLlMzT3JpZ2luKHNpdGVCdWNrZXQsIHtvcmlnaW5BY2Nlc3NJZGVudGl0eTogY2xvdWRmcm9udE9BSX0pLFxuLy8gICAgICAgICBjb21wcmVzczogdHJ1ZSxcbi8vICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQWxsb3dlZE1ldGhvZHMuQUxMT1dfR0VUX0hFQURfT1BUSU9OUyxcbi8vICAgICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IGNsb3VkZnJvbnQuVmlld2VyUHJvdG9jb2xQb2xpY3kuQUxMT1dfQUxMLCAvLyBBbGxvdyBib3RoIEhUVFAgYW5kIEhUVFBTXG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG5cbi8vICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdEaXN0cmlidXRpb25JZCcsIHsgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCB9KTtcblxuLy8gICAgIC8vIERlcGxveSBzaXRlIGNvbnRlbnRzIHRvIFMzIGJ1Y2tldFxuLy8gICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lXaXRoSW52YWxpZGF0aW9uJywge1xuLy8gICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoSm9pbihfX2Rpcm5hbWUsICcuL3NpdGUtY29udGVudHMnKSldLFxuLy8gICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4vLyAgICAgICBkaXN0cmlidXRpb24sXG4vLyAgICAgICBkaXN0cmlidXRpb25QYXRoczogWycvKiddLFxuLy8gICAgIH0pO1xuLy8gICB9XG4vLyB9XG4iXX0=