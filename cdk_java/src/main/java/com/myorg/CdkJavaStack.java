package com.myorg;

import software.amazon.awscdk.services.cloudfront.*;
import software.amazon.awscdk.services.iam.Effect;
import software.amazon.awscdk.services.iam.PolicyStatement;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.s3.BucketAccessControl;
import software.amazon.awscdk.services.s3.deployment.BucketDeployment;
import software.amazon.awscdk.services.s3.deployment.Source;
import software.constructs.Construct;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;


import java.util.Collections;
import java.util.List;
// import software.amazon.awscdk.Duration;
// import software.amazon.awscdk.services.sqs.Queue;

public class CdkJavaStack extends Stack {
    public CdkJavaStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public CdkJavaStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // The code that defines your stack goes here

        // example resource
        // final Queue queue = Queue.Builder.create(this, "CdkJavaQueue")
        //         .visibilityTimeout(Duration.seconds(300))
        //         .build();

        Bucket myBucket = Bucket.Builder.create(this, "MyBucket")
                .versioned(false)
                .bucketName("rs-spa")
                .websiteIndexDocument("index.html")
                .websiteErrorDocument("index.html")
                .publicReadAccess(false)
                .accessControl(BucketAccessControl.PRIVATE)
                .build();

        OriginAccessIdentity originAccessIdentity = OriginAccessIdentity.Builder.create(this, "OAI")
                .comment("OAI for my SPA")
                .build();

        myBucket.addToResourcePolicy(PolicyStatement.Builder.create()
                .effect(Effect.ALLOW)
                .principals(Collections.singletonList(originAccessIdentity.getGrantPrincipal()))
                .actions(Collections.singletonList("s3:GetObject"))
                .resources(Collections.singletonList(myBucket.arnForObjects("*")))
                .build());

        CloudFrontWebDistribution distribution = CloudFrontWebDistribution.Builder.create(this, "SiteDistribution")
                .originConfigs(Collections.singletonList(
                        SourceConfiguration.builder()
                                .s3OriginSource(S3OriginConfig.builder()
                                        .s3BucketSource(myBucket)
                                        .originAccessIdentity(originAccessIdentity)
                                        .build())
                                .behaviors(Collections.singletonList(Behavior.builder().isDefaultBehavior(true).build()))
                                .build()))
                .build();

        BucketDeployment.Builder.create(this, "DeployWebsite")
                .sources(Collections.singletonList(Source.asset("../dist")))
                .destinationBucket(myBucket)
                .distribution(distribution)
                .distributionPaths(Collections.singletonList("/*")) // Инвалидация всех путей
                .build();
    }
}
