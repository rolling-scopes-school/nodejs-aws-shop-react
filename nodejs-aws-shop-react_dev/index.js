#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const cloudfront_origins = require("aws-cdk-lib/aws-cloudfront-origins");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class StaticSite extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, 
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
            sources: [s3deploy.Source.asset('./site-contents')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}
class MyStaticSiteStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new StaticSite(this, 'StaticSite');
    }
}
const app = new cdk.App();
new MyStaticSiteStack(app, 'MyStaticSite', {
    env: { account: '761576343621', region: 'us-east-1' }, // 
});
app.synth();
// #!/usr/bin/env node
// import * as cdk from 'aws-cdk-lib';
// import { StaticSite } from './static-site';
// /**
//  * This stack relies on getting the domain name from CDK context.
//  * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
//  * Or add the following to cdk.json:
//  * {
//  *   "context": {
//  *     "domain": "mystaticsite.com",
//  *     "subdomain": "www",
//  *     "accountId": "1234567890",
//  *   }
//  * }
// **/
// class MyStaticSiteStack extends cdk.Stack {
//     constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
//         super(parent, name, props);
//         new StaticSite(this, 'StaticSite', {
//             domainName: this.node.tryGetContext('domain'),
//             siteSubDomain: this.node.tryGetContext('subdomain'),
//         });
//     }
// }
// const app = new cdk.App();
// new MyStaticSiteStack(app, 'MyStaticSite', {
//     /**
//      * This is required for our use of hosted-zone lookup.
//      *
//      * Lookups do not work at all without an explicit environment
//      * specified; to use them, you must specify env.
//      * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
//      */
//     env: {
//         account: app.node.tryGetContext('accountId'),
//         /**
//          * Stack must be in us-east-1, because the ACM certificate for a
//          * global CloudFront distribution must be requested in us-east-1.
//          */
//         region: 'us-east-1',
//     }
// });
// app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBbUM7QUFDbkMsMkNBQXVDO0FBQ3ZDLHlDQUF5QztBQUN6Qyx5REFBeUQ7QUFDekQsMERBQTBEO0FBQzFELHlFQUF5RTtBQUN6RSw2Q0FBNEM7QUFFNUMsTUFBTSxVQUFXLFNBQVEsc0JBQVM7SUFDaEMsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpQkFBaUI7UUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDbkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsc0NBQXNDO1NBQ2hFLENBQUMsQ0FBQztRQUVILGdEQUFnRDtRQUNoRCxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3pFLGlCQUFpQixFQUFFLFlBQVk7WUFDL0IsZUFBZSxFQUFFO2dCQUNmLE1BQU0sRUFBRSxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQ25ELG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCO2FBQy9GO1lBQ0QsK0RBQStEO1lBQy9ELGdFQUFnRTtTQUNqRSxDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3hELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbkQsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixZQUFZO1lBQ1osaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxpQkFBa0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN2QyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksaUJBQWlCLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRTtJQUN6QyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSwyREFBMkQ7Q0FDbkgsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBSVosc0JBQXNCO0FBQ3RCLHNDQUFzQztBQUN0Qyw4Q0FBOEM7QUFFOUMsTUFBTTtBQUNOLG9FQUFvRTtBQUNwRSxpRUFBaUU7QUFDakUsdUNBQXVDO0FBQ3ZDLE9BQU87QUFDUCxvQkFBb0I7QUFDcEIsdUNBQXVDO0FBQ3ZDLDZCQUE2QjtBQUM3QixvQ0FBb0M7QUFDcEMsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNO0FBQ04sOENBQThDO0FBQzlDLDBFQUEwRTtBQUMxRSxzQ0FBc0M7QUFFdEMsK0NBQStDO0FBQy9DLDZEQUE2RDtBQUM3RCxtRUFBbUU7QUFDbkUsY0FBYztBQUNkLFFBQVE7QUFDUixJQUFJO0FBRUosNkJBQTZCO0FBRTdCLCtDQUErQztBQUMvQyxVQUFVO0FBQ1YsNkRBQTZEO0FBQzdELFNBQVM7QUFDVCxvRUFBb0U7QUFDcEUsdURBQXVEO0FBQ3ZELDZFQUE2RTtBQUM3RSxVQUFVO0FBQ1YsYUFBYTtBQUNiLHdEQUF3RDtBQUN4RCxjQUFjO0FBQ2QsMkVBQTJFO0FBQzNFLDRFQUE0RTtBQUM1RSxjQUFjO0FBQ2QsK0JBQStCO0FBQy9CLFFBQVE7QUFDUixNQUFNO0FBRU4sZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIHMzZGVwbG95IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1kZXBsb3ltZW50JztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnRfb3JpZ2lucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udC1vcmlnaW5zJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmNsYXNzIFN0YXRpY1NpdGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIENvbnRlbnQgYnVja2V0XG4gICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NpdGVCdWNrZXQnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSwgLy8gTk9UIHJlY29tbWVuZGVkIGZvciBwcm9kdWN0aW9uIGNvZGVcbiAgICB9KTtcblxuICAgIC8vIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIHRoYXQgb25seSBzZXJ2ZXMgSFRUUFxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbih0aGlzLCAnU2l0ZURpc3RyaWJ1dGlvbicsIHtcbiAgICAgIGRlZmF1bHRSb290T2JqZWN0OiBcImluZGV4Lmh0bWxcIixcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICBvcmlnaW46IG5ldyBjbG91ZGZyb250X29yaWdpbnMuUzNPcmlnaW4oc2l0ZUJ1Y2tldCksXG4gICAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBjbG91ZGZyb250LlZpZXdlclByb3RvY29sUG9saWN5LkFMTE9XX0FMTCwgLy8gQWxsb3dzIGJvdGggSFRUUCBhbmQgSFRUUFNcbiAgICAgIH0sXG4gICAgICAvLyBOb3RlOiBCeSBkZWZhdWx0LCBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbnMgYXJlIEhUVFBTLWVuYWJsZWRcbiAgICAgIC8vIFRoZSBWaWV3ZXJQcm90b2NvbFBvbGljeS5BTExPV19BTEwgc2V0dGluZyBhbGxvd3MgSFRUUCBhY2Nlc3NcbiAgICB9KTtcblxuICAgIC8vIERlcGxveSBzaXRlIGNvbnRlbnRzIHRvIFMzIGJ1Y2tldFxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lTaXRlQ29udGVudHMnLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KCcuL3NpdGUtY29udGVudHMnKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogc2l0ZUJ1Y2tldCxcbiAgICAgIGRpc3RyaWJ1dGlvbixcbiAgICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbJy8qJ10sXG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgTXlTdGF0aWNTaXRlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IFN0YXRpY1NpdGUodGhpcywgJ1N0YXRpY1NpdGUnKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgTXlTdGF0aWNTaXRlU3RhY2soYXBwLCAnTXlTdGF0aWNTaXRlJywge1xuICBlbnY6IHsgYWNjb3VudDogJzc2MTU3NjM0MzYyMScsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSwgLy8g0JfQsNC80LXQvdC40YLQtSDQvdCwINCy0LDRiCBBV1MgYWNjb3VudCBJRCDQuCDQv9GA0LXQtNC/0L7Rh9GC0LjRgtC10LvRjNC90YvQuSDRgNC10LPQuNC+0L1cbn0pO1xuXG5hcHAuc3ludGgoKTtcblxuXG5cbi8vICMhL3Vzci9iaW4vZW52IG5vZGVcbi8vIGltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG4vLyBpbXBvcnQgeyBTdGF0aWNTaXRlIH0gZnJvbSAnLi9zdGF0aWMtc2l0ZSc7XG5cbi8vIC8qKlxuLy8gICogVGhpcyBzdGFjayByZWxpZXMgb24gZ2V0dGluZyB0aGUgZG9tYWluIG5hbWUgZnJvbSBDREsgY29udGV4dC5cbi8vICAqIFVzZSAnY2RrIHN5bnRoIC1jIGRvbWFpbj1teXN0YXRpY3NpdGUuY29tIC1jIHN1YmRvbWFpbj13d3cnXG4vLyAgKiBPciBhZGQgdGhlIGZvbGxvd2luZyB0byBjZGsuanNvbjpcbi8vICAqIHtcbi8vICAqICAgXCJjb250ZXh0XCI6IHtcbi8vICAqICAgICBcImRvbWFpblwiOiBcIm15c3RhdGljc2l0ZS5jb21cIixcbi8vICAqICAgICBcInN1YmRvbWFpblwiOiBcInd3d1wiLFxuLy8gICogICAgIFwiYWNjb3VudElkXCI6IFwiMTIzNDU2Nzg5MFwiLFxuLy8gICogICB9XG4vLyAgKiB9XG4vLyAqKi9cbi8vIGNsYXNzIE15U3RhdGljU2l0ZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbi8vICAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzKSB7XG4vLyAgICAgICAgIHN1cGVyKHBhcmVudCwgbmFtZSwgcHJvcHMpO1xuXG4vLyAgICAgICAgIG5ldyBTdGF0aWNTaXRlKHRoaXMsICdTdGF0aWNTaXRlJywge1xuLy8gICAgICAgICAgICAgZG9tYWluTmFtZTogdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ2RvbWFpbicpLFxuLy8gICAgICAgICAgICAgc2l0ZVN1YkRvbWFpbjogdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3N1YmRvbWFpbicpLFxuLy8gICAgICAgICB9KTtcbi8vICAgICB9XG4vLyB9XG5cbi8vIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbi8vIG5ldyBNeVN0YXRpY1NpdGVTdGFjayhhcHAsICdNeVN0YXRpY1NpdGUnLCB7XG4vLyAgICAgLyoqXG4vLyAgICAgICogVGhpcyBpcyByZXF1aXJlZCBmb3Igb3VyIHVzZSBvZiBob3N0ZWQtem9uZSBsb29rdXAuXG4vLyAgICAgICpcbi8vICAgICAgKiBMb29rdXBzIGRvIG5vdCB3b3JrIGF0IGFsbCB3aXRob3V0IGFuIGV4cGxpY2l0IGVudmlyb25tZW50XG4vLyAgICAgICogc3BlY2lmaWVkOyB0byB1c2UgdGhlbSwgeW91IG11c3Qgc3BlY2lmeSBlbnYuXG4vLyAgICAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9lbnZpcm9ubWVudHMuaHRtbFxuLy8gICAgICAqL1xuLy8gICAgIGVudjoge1xuLy8gICAgICAgICBhY2NvdW50OiBhcHAubm9kZS50cnlHZXRDb250ZXh0KCdhY2NvdW50SWQnKSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICAqIFN0YWNrIG11c3QgYmUgaW4gdXMtZWFzdC0xLCBiZWNhdXNlIHRoZSBBQ00gY2VydGlmaWNhdGUgZm9yIGFcbi8vICAgICAgICAgICogZ2xvYmFsIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIG11c3QgYmUgcmVxdWVzdGVkIGluIHVzLWVhc3QtMS5cbi8vICAgICAgICAgICovXG4vLyAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4vLyAgICAgfVxuLy8gfSk7XG5cbi8vIGFwcC5zeW50aCgpO1xuIl19