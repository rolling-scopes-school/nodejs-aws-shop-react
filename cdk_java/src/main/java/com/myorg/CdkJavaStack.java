package com.myorg;

import java.util.Arrays;

import software.amazon.awscdk.RemovalPolicy;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.cloudfront.BehaviorOptions;
import software.amazon.awscdk.services.cloudfront.Distribution;
import software.amazon.awscdk.services.cloudfront.OriginAccessIdentity;
import software.amazon.awscdk.services.cloudfront.ViewerProtocolPolicy;
import software.amazon.awscdk.services.cloudfront.origins.S3Origin;
import software.amazon.awscdk.services.iam.PolicyStatement;
import software.amazon.awscdk.services.iam.ServicePrincipal;
import software.amazon.awscdk.services.s3.BlockPublicAccess;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.s3.deployment.BucketDeployment;
import software.amazon.awscdk.services.s3.deployment.Source;
import software.constructs.Construct;

public class CdkJavaStack extends Stack {

    public CdkJavaStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public CdkJavaStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // Create S3 bucket
        Bucket bucket = Bucket.Builder.create(this, "rs-module2-bucket")
                .removalPolicy(RemovalPolicy.DESTROY)
                .blockPublicAccess(BlockPublicAccess.BLOCK_ALL)
                .autoDeleteObjects(true).build();

        // Create Origin Access Identity
        OriginAccessIdentity originAccessIdentity = OriginAccessIdentity.Builder.create(this, "OAI").build();

        // Create S3 Origin
        S3Origin origin = S3Origin.Builder.create(bucket).originAccessIdentity(originAccessIdentity).build();

        // Define CloudFront Behavior Options
        BehaviorOptions behaviorOptions = BehaviorOptions.builder()
        .viewerProtocolPolicy(ViewerProtocolPolicy.REDIRECT_TO_HTTPS)
        .origin(origin)
        .build();

        // Create CloudFront distribution
        Distribution clDistribution = Distribution.Builder.create(this, "MyStaticSiteDistribution")
        .defaultBehavior(behaviorOptions)
        .defaultRootObject("index.html")
        .build();

        // Create and attach policy statement to the bucket
        PolicyStatement policyStatement = new PolicyStatement();
        policyStatement.addActions("s3:GetObject");
        policyStatement.addResources(bucket.arnForObjects("*"));
        policyStatement.addPrincipals(ServicePrincipal.Builder.create("cloudfront.amazonaws.com").build());
        policyStatement.addCondition("StringEquals", java.util.Collections.singletonMap("AWS:SourceArn", 
        "arn:aws:cloudfront::" + Stack.of(this).getAccount() + ":distribution/" + clDistribution.getDistributionId()));

        bucket.addToResourcePolicy(policyStatement);

        // Create bucket deployment
        BucketDeployment bucketDeployment = BucketDeployment.Builder.create(this, "BucketDeployment")
        .sources(Arrays.asList(Source.asset("../dist")))
        .destinationBucket(bucket)
        .distribution(clDistribution)
        .distributionPaths(Arrays.asList("/*"))
        .build();
    }
}
