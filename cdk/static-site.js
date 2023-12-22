#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSite = void 0;
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
class StaticSite extends core_1.Construct {
    constructor(parent, name) {
        super(parent, name);
        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "My-OAI");
        const siteBucket = new s3.Bucket(this, "MyStaticBucket", {
            bucketName: "my-cloudfront-s3",
            websiteIndexDocument: "index.html",
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });
        siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ["S3:GetObject"],
            resources: [siteBucket.arnForObjects("*")],
            principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "My-distribution", {
            originConfigs: [{
                    s3OriginSource: {
                        s3BucketSource: siteBucket,
                        originAccessIdentity: cloudfrontOAI,
                    },
                    behaviors: [{
                            isDefaultBehavior: true
                        }]
                }]
        });
        new s3deploy.BucketDeployment(this, "My-Bucket-Deployment", {
            sources: [s3deploy.Source.asset("../dist")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"]
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0Esc0NBQXNDO0FBQ3RDLHVEQUF1RDtBQUN2RCxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUFpRDtBQUdqRCxNQUFhLFVBQVcsU0FBUSxnQkFBUztJQUNyQyxZQUFZLE1BQWEsRUFBRSxJQUFZO1FBQ25DLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ3pFLE1BQU0sVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDckQsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7U0FDcEQsQ0FBQyxDQUFBO1FBRUYsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNuRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUM5RyxDQUFDLENBQUMsQ0FBQTtRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNuRixhQUFhLEVBQUUsQ0FBQztvQkFDWixjQUFjLEVBQUU7d0JBQ1osY0FBYyxFQUFFLFVBQVU7d0JBQzFCLG9CQUFvQixFQUFFLGFBQWE7cUJBQ3RDO29CQUNELFNBQVMsRUFBRSxDQUFDOzRCQUNSLGlCQUFpQixFQUFFLElBQUk7eUJBQzFCLENBQUM7aUJBQ0wsQ0FBQztTQUNMLENBQUMsQ0FBQTtRQUVGLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUN4RCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQyxpQkFBaUIsRUFBRSxVQUFVO1lBQzdCLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQztTQUM1QixDQUFDLENBQUE7SUFDTixDQUFDO0NBQ0o7QUFwQ0QsZ0NBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxyXG4vL0B0cy1ub2NoZWNrXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWRlcGxveW1lbnQnO1xyXG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250JztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRpY1NpdGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBTdGFjaywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50LCBuYW1lKTtcclxuICAgICAgICBjb25zdCBjbG91ZGZyb250T0FJID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkodGhpcywgXCJNeS1PQUlcIilcclxuICAgICAgICBjb25zdCBzaXRlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBcIk15U3RhdGljQnVja2V0XCIsIHtcclxuICAgICAgICAgICAgYnVja2V0TmFtZTogXCJteS1jbG91ZGZyb250LXMzXCIsXHJcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiBcImluZGV4Lmh0bWxcIixcclxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTExcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzaXRlQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJTMzpHZXRPYmplY3RcIl0sXHJcbiAgICAgICAgICAgIHJlc291cmNlczogW3NpdGVCdWNrZXQuYXJuRm9yT2JqZWN0cyhcIipcIildLFxyXG4gICAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5DYW5vbmljYWxVc2VyUHJpbmNpcGFsKGNsb3VkZnJvbnRPQUkuY2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5UzNDYW5vbmljYWxVc2VySWQpXVxyXG4gICAgICAgIH0pKVxyXG5cclxuICAgICAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHRoaXMsIFwiTXktZGlzdHJpYnV0aW9uXCIsIHtcclxuICAgICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcclxuICAgICAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNpdGVCdWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHk6IGNsb3VkZnJvbnRPQUksICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiZWhhdmlvcnM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWVcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgXCJNeS1CdWNrZXQtRGVwbG95bWVudFwiLCB7XHJcbiAgICAgICAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQoXCIuLi9kaXN0XCIpXSxcclxuICAgICAgICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXHJcbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvbixcclxuICAgICAgICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFtcIi8qXCJdXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG4iXX0=