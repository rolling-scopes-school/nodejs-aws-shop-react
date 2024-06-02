package dev.avorakh;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import software.amazon.awscdk.RemovalPolicy;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.s3.BlockPublicAccess;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.s3.deployment.BucketDeployment;
import software.amazon.awscdk.services.s3.deployment.Source;
import software.constructs.Construct;

import java.util.List;

public class S3StaticSiteCdkJavaStack extends Stack {

    public static final String S3_BUCKET_NAME = "avorakh-cdk-nodejs-aws-shop-react";
    public static final String INDEX_HTML = "index.html";
    public static final String DEPLOY_WITH_INVALIDATION = "DeployWithInvalidation";

    public S3StaticSiteCdkJavaStack(@Nullable Construct scope, @Nullable String id) {
        super(scope, id, null);
    }

    public S3StaticSiteCdkJavaStack(@Nullable Construct scope, @Nullable String id, @Nullable StackProps props) {
        super(scope, id, props);
        String siteContentsPath = "./../dist";
        var siteBucket = createSiteS3Bucket();
        deploySiteContents(siteBucket, siteContentsPath);
    }

    private static @NotNull BlockPublicAccess allowPublicAccessConfig() {
        return BlockPublicAccess.Builder.create()
                .restrictPublicBuckets(false)
                .blockPublicAcls(false)
                .blockPublicPolicy(false)
                .ignorePublicAcls(false)
                .build();
    }

    private @NotNull Bucket createSiteS3Bucket() {
        return Bucket.Builder.create(this, S3_BUCKET_NAME)
                .bucketName(S3_BUCKET_NAME)
                .versioned(true)
                .websiteIndexDocument(INDEX_HTML)
                .publicReadAccess(true)
                .blockPublicAccess(allowPublicAccessConfig())
                .removalPolicy(RemovalPolicy.DESTROY)
                .autoDeleteObjects(true)
                .build();
    }

    private void deploySiteContents(Bucket siteBucket, String siteContentsPath) {
        BucketDeployment.Builder.create(this, DEPLOY_WITH_INVALIDATION)
                .sources(List.of(Source.asset(siteContentsPath)))
                .destinationBucket(siteBucket)
                .build();
    }
}
