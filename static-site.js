#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSite = void 0;
//@ts-nocheck
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
class StaticSite extends core_1.Construct {
    constructor(parent, name) {
        super(parent, name);
        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "JSCC-OAI");
        const siteBucket = new s3.Bucket(this, 'JSCCStaticBucket', {
            bucketName: 'js-cc-nm-cloudfront-s3',
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });
        siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ["S3:GetObject"],
            resources: [siteBucket.arnForObjects("*")],
            principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "JSCC-Distribution", {
            originConfigs: [{
                    s3OriginSource: {
                        s3BucketSource: siteBucket,
                        originAccessIdentity: cloudfrontOAI
                    },
                    behaviors: [{
                            isDefaultBehavior: true
                        }]
                }]
        });
        new s3deploy.BucketDeployment(this, "JSCC-Bucket-Deployment", {
            sources: [s3deploy.Source.asset("./dist")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"]
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsYUFBYTtBQUNiLHNDQUFzQztBQUN0Qyx1REFBdUQ7QUFDdkQsc0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4Qyx3Q0FBaUQ7QUFFakQsTUFBYSxVQUFXLFNBQVEsZ0JBQVM7SUFDdkMsWUFBWSxNQUFhLEVBQUUsSUFBWTtRQUNyQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBCLE1BQU0sYUFBYSxHQUFHLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUU1RSxNQUFNLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3pELFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1NBQ2xELENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDNUcsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDdkYsYUFBYSxFQUFFLENBQUM7b0JBQ2QsY0FBYyxFQUFFO3dCQUNkLGNBQWMsRUFBRSxVQUFVO3dCQUMxQixvQkFBb0IsRUFBRSxhQUFhO3FCQUNwQztvQkFDRCxTQUFTLEVBQUUsQ0FBQzs0QkFDVixpQkFBaUIsRUFBRSxJQUFJO3lCQUN4QixDQUFDO2lCQUNILENBQUM7U0FDSCxDQUFDLENBQUE7UUFFRixJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDNUQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUMsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixZQUFZO1lBQ1osaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDMUIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBdENELGdDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuLy9AdHMtbm9jaGVja1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdAYXdzLWNkay9hd3MtczMtZGVwbG95bWVudCc7XHJcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3VkZnJvbnQnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0aWNTaXRlIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IFN0YWNrLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKHBhcmVudCwgbmFtZSk7XHJcblxyXG4gICAgY29uc3QgY2xvdWRmcm9udE9BSSA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsIFwiSlNDQy1PQUlcIik7XHJcblxyXG4gICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0pTQ0NTdGF0aWNCdWNrZXQnLCB7XHJcbiAgICAgIGJ1Y2tldE5hbWU6ICdqcy1jYy1ubS1jbG91ZGZyb250LXMzJyxcclxuICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcclxuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXHJcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTExcclxuICAgIH0pO1xyXG5cclxuICAgIHNpdGVCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgIGFjdGlvbnM6IFtcIlMzOkdldE9iamVjdFwiXSxcclxuICAgICAgcmVzb3VyY2VzOiBbc2l0ZUJ1Y2tldC5hcm5Gb3JPYmplY3RzKFwiKlwiKV0sXHJcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkNhbm9uaWNhbFVzZXJQcmluY2lwYWwoY2xvdWRmcm9udE9BSS5jbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlTM0Nhbm9uaWNhbFVzZXJJZCldXHJcbiAgICB9KSk7XHJcblxyXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCBcIkpTQ0MtRGlzdHJpYnV0aW9uXCIsIHtcclxuICAgICAgb3JpZ2luQ29uZmlnczogW3tcclxuICAgICAgICBzM09yaWdpblNvdXJjZToge1xyXG4gICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNpdGVCdWNrZXQsXHJcbiAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eTogY2xvdWRmcm9udE9BSVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmVoYXZpb3JzOiBbe1xyXG4gICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWVcclxuICAgICAgICB9XVxyXG4gICAgICB9XVxyXG4gICAgfSlcclxuXHJcbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCBcIkpTQ0MtQnVja2V0LURlcGxveW1lbnRcIiwge1xyXG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KFwiLi9kaXN0XCIpXSxcclxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXHJcbiAgICAgIGRpc3RyaWJ1dGlvbixcclxuICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFtcIi8qXCJdXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG4iXX0=