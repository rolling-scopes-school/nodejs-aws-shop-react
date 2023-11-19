#!/usr/bin/env node
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.StaticSite = void 0;
var cloudfront = require("@aws-cdk/aws-cloudfront");
var iam = require("@aws-cdk/aws-iam");
var s3 = require("@aws-cdk/aws-s3");
var s3deploy = require("@aws-cdk/aws-s3-deployment");
var core_1 = require("@aws-cdk/core");
var StaticSite = /** @class */ (function (_super) {
    __extends(StaticSite, _super);
    function StaticSite(parent, name) {
        var _this = _super.call(this, parent, name) || this;
        var cloudfrontOAI = new cloudfront.OriginAccessIdentity(_this, "TKStaticReactSite");
        var bucket = new s3.Bucket(_this, 'TKStaticReactSite', {
            bucketName: "tk-react-cloudfront-s3",
            websiteIndexDocument: "index.html",
            publicReadAccess: true
        });
        bucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ["S3:GetObject"],
            resources: [bucket.arnForObjects("*")],
            principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        var distribution = new cloudfront.CloudFrontWebDistribution(_this, "TKStaticReactSite", {
            originConfigs: [{
                    s3OriginSource: {
                        s3BucketSource: bucket,
                        originAccessIdentity: cloudfrontOAI
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true
                        }
                    ]
                }]
        });
        new s3deploy.BucketDeployment(_this, "TKStaticReactSite", {
            sources: [s3deploy.Source.asset("../dist")],
            destinationBucket: bucket,
            distribution: distribution,
            distributionPaths: ['/*']
        });
        return _this;
    }
    return StaticSite;
}(core_1.Construct));
exports.StaticSite = StaticSite;
