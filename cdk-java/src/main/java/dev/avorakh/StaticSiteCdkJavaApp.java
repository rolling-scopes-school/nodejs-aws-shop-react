package dev.avorakh;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Environment;
import software.amazon.awscdk.StackProps;

public class StaticSiteCdkJavaApp {

    public static final String CDK_DEFAULT_ACCOUNT = "CDK_DEFAULT_ACCOUNT";
    public static final String CDK_DEFAULT_REGION = "CDK_DEFAULT_REGION";
    public static final String MY_SHOP_S_3_STATIC_SITE_CDK_JAVA_STACK = "MyShopS3StaticSiteCdkJavaStack";

    public static void main(final String[] args) {
        var app = new App();

        var pr = StackProps.builder()
                .env(Environment.builder()
                        .account(System.getenv(CDK_DEFAULT_ACCOUNT))
                        .region(System.getenv(CDK_DEFAULT_REGION))
                        .build())
                .build();

        new S3StaticSiteCdkJavaStack(app, MY_SHOP_S_3_STATIC_SITE_CDK_JAVA_STACK,pr);

        app.synth();
    }
}

