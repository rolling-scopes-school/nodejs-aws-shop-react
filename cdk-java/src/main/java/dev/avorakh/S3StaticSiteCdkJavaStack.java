package dev.avorakh;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import software.amazon.awscdk.CfnOutput;
import software.amazon.awscdk.RemovalPolicy;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.cloudfront.*;
import software.amazon.awscdk.services.iam.CanonicalUserPrincipal;
import software.amazon.awscdk.services.iam.Effect;
import software.amazon.awscdk.services.iam.PolicyStatement;
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
    public static final String MY_SHOP_STATIC_SITE_OAI = "MyShopStaticSiteOAI";
    public static final String S_3_GET_OBJECT = "s3:GetObject";
    public static final String ALL_RESOURCES = "/*";

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

        var oai = createOriginAccessIdentity();

        // CloudFrontWebDistribution distribution
        var distribution = createCloudFrontWebDistribution(siteBucket, oai);
        CfnOutput.Builder.create(this, DISTRIBUTION_ID)
                .description(CLOUD_FRONT_DISTRIBUTION_ID)
                .value(distribution.getDistributionId())
                .build();

        // Add a bucket policy to allow CloudFront to access the S3 bucket
        addBucketPolicy(siteBucket, oai);

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

    private static void addBucketPolicy(Bucket siteBucket, OriginAccessIdentity oai) {
        siteBucket.addToResourcePolicy(PolicyStatement.Builder.create()
                .actions(List.of(S_3_GET_OBJECT))
                .resources(List.of(siteBucket.getBucketArn() + ALL_RESOURCES))
                .principals(List.of(new CanonicalUserPrincipal(oai.getCloudFrontOriginAccessIdentityS3CanonicalUserId())))
                .effect(Effect.ALLOW)
                .build());
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

    private @NotNull CloudFrontWebDistribution createCloudFrontWebDistribution(Bucket siteBucket, OriginAccessIdentity oai) {

        var sourceConfigurationsList = List.of(
                SourceConfiguration.builder()
                        .s3OriginSource(
                                S3OriginConfig.builder().s3BucketSource(siteBucket).originAccessIdentity(oai).build()
                        )
                        .behaviors(List.of(Behavior.builder().isDefaultBehavior(true).build()))
                        .build()
        );

        return CloudFrontWebDistribution.Builder.create(this, SITE_DISTRIBUTION)
                .originConfigs(sourceConfigurationsList)
                .build();
    }

    private @NotNull OriginAccessIdentity createOriginAccessIdentity() {
        return OriginAccessIdentity.Builder.create(this, MY_SHOP_STATIC_SITE_OAI)
                .comment(MY_SHOP_STATIC_SITE_OAI)
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