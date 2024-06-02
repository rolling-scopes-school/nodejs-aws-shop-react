package dev.avorakh;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import software.amazon.awscdk.CfnOutput;
import software.amazon.awscdk.RemovalPolicy;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.cloudfront.Behavior;
import software.amazon.awscdk.services.cloudfront.CloudFrontWebDistribution;
import software.amazon.awscdk.services.cloudfront.S3OriginConfig;
import software.amazon.awscdk.services.cloudfront.SourceConfiguration;
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
    public static final String ALL_FILES_PATH = "/*";
    public static final String SITE_DISTRIBUTION = "SiteDistribution";
    public static final String DISTRIBUTION_ID = "DistributionId";
    public static final String CLOUD_FRONT_DISTRIBUTION_ID = "CloudFront Distribution Id";
    public static final String BUCKET = "Bucket";
    public static final String BUCKET_NAME = "Bucket Name";

    public S3StaticSiteCdkJavaStack(@Nullable Construct scope, @Nullable String id) {
        super(scope, id, null);
    }

    public S3StaticSiteCdkJavaStack(@Nullable Construct scope, @Nullable String id, @Nullable StackProps props) {
        super(scope, id, props);

        var siteContentsPath = "./../dist";

        var siteBucket = createSiteS3Bucket(false);
        CfnOutput.Builder.create(this, BUCKET)
                .description(BUCKET_NAME)
                .value(siteBucket.getBucketName())
                .build();

        // CloudFrontWebDistribution distribution
        var distribution = createCloudFrontWebDistribution(siteBucket);
        CfnOutput.Builder.create(this, DISTRIBUTION_ID)
                .description(CLOUD_FRONT_DISTRIBUTION_ID)
                .value(distribution.getDistributionId())
                .build();

        deploySiteContents(siteBucket, siteContentsPath, distribution);
    }


    private static @NotNull BlockPublicAccess createBlockPublicAccess(boolean enabled) {
        return BlockPublicAccess.Builder.create()
                .restrictPublicBuckets(enabled)
                .blockPublicAcls(enabled)
                .blockPublicPolicy(enabled)
                .ignorePublicAcls(enabled)
                .build();
    }

    private @NotNull Bucket createSiteS3Bucket(boolean enablePublicReadAccess) {
        return Bucket.Builder.create(this, S3_BUCKET_NAME)
                .bucketName(S3_BUCKET_NAME)
                .versioned(true)
                .websiteIndexDocument(INDEX_HTML)
                .publicReadAccess(enablePublicReadAccess)
                .blockPublicAccess(createBlockPublicAccess(!enablePublicReadAccess))
                .removalPolicy(RemovalPolicy.DESTROY)
                .autoDeleteObjects(true)
                .build();
    }

    private @NotNull CloudFrontWebDistribution createCloudFrontWebDistribution(Bucket siteBucket) {
        var sourceConfigurationsList = List.of(
                SourceConfiguration.builder()
                        .s3OriginSource(S3OriginConfig.builder().s3BucketSource(siteBucket).build())
                        .behaviors(List.of(Behavior.builder().isDefaultBehavior(true).build()))
                        .build()
        );

        return CloudFrontWebDistribution.Builder.create(this, SITE_DISTRIBUTION)
                .originConfigs(sourceConfigurationsList)
                .build();
    }

    private void deploySiteContents(Bucket siteBucket, String siteContentsPath, CloudFrontWebDistribution distribution) {
        BucketDeployment.Builder.create(this, DEPLOY_WITH_INVALIDATION)
                .sources(List.of(Source.asset(siteContentsPath)))
                .destinationBucket(siteBucket)
                .distribution(distribution)
                .distributionPaths(List.of(ALL_FILES_PATH))  // Invalidation
                .build();
    }
}
