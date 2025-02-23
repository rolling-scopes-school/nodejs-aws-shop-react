package com.myorg;

import software.amazon.awscdk.*;
import software.amazon.awscdk.services.cloudfront.*;
import software.amazon.awscdk.services.cloudfront.origins.S3Origin;
import software.amazon.awscdk.services.cloudfront.origins.S3OriginProps;
import software.amazon.awscdk.services.iam.*;
import software.amazon.awscdk.services.s3.*;
import software.amazon.awscdk.services.s3.deployment.*;
import software.constructs.Construct;

import java.util.List;

public class CdkJavaStack extends Stack {
    public CdkJavaStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // 🔹 1. Создаем S3-бакет (НЕ static website)
        Bucket siteBucket = Bucket.Builder.create(this, "MyShopBucket")
                .blockPublicAccess(BlockPublicAccess.BLOCK_ALL) // ❌ Запрещаем публичный доступ
                .removalPolicy(RemovalPolicy.DESTROY)
                .autoDeleteObjects(true)
                .build();

        // 🔹 2. Создаем CloudFront Origin Access Identity (OAI)
        OriginAccessIdentity cloudfrontOAI = OriginAccessIdentity.Builder.create(this, "MyShopOAI")
                .comment("OAI for MyShop CloudFront")
                .build();

        // ✅ Разрешаем CloudFront OAI доступ к файлам в S3
        siteBucket.addToResourcePolicy(PolicyStatement.Builder.create()
                .actions(List.of("s3:GetObject"))
                .resources(List.of(siteBucket.getBucketArn() + "/*"))
                .principals(List.of(new CanonicalUserPrincipal(cloudfrontOAI.getCloudFrontOriginAccessIdentityS3CanonicalUserId())))
                .build());

        // 🔹 3. Создаем CloudFront Distribution (НЕ static website)
        Distribution distribution = Distribution.Builder.create(this, "MyShopCDN")
                .defaultBehavior(BehaviorOptions.builder()
                        .origin(new S3Origin(siteBucket, S3OriginProps.builder()
                                .originAccessIdentity(cloudfrontOAI)
                                .build()))
                        .viewerProtocolPolicy(ViewerProtocolPolicy.REDIRECT_TO_HTTPS)
                        .cachePolicy(CachePolicy.CACHING_OPTIMIZED)
                        .build())
                .defaultRootObject("index.html")
                .errorResponses(List.of(
                        ErrorResponse.builder()
                                .httpStatus(403)
                                .responseHttpStatus(200)
                                .responsePagePath("/index.html")
                                .build(),
                        ErrorResponse.builder()
                                .httpStatus(404)
                                .responseHttpStatus(200)
                                .responsePagePath("/index.html")
                                .build()
                ))
                .build();

        // 🔹 4. Деплоим файлы в S3 и сбрасываем кеш CloudFront
        BucketDeployment.Builder.create(this, "MyShopDeployment")
                .sources(List.of(Source.asset("../dist")))
                .destinationBucket(siteBucket)
                .distribution(distribution)
                .distributionPaths(List.of("/*")) // Очищает кеш CloudFront
                .build();

        // 🔹 5. Выводим CloudFront URL
        CfnOutput.Builder.create(this, "CloudFrontURL")
                .value("https://" + distribution.getDistributionDomainName())
                .description("CloudFront URL")
                .build();
    }
}
