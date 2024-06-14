package dev.avorakh;

import software.amazon.awscdk.App;
import software.amazon.awscdk.StackProps;

public class StaticSiteCdkJavaApp {

    public static final String MY_SHOP_S_3_STATIC_SITE_CDK_JAVA_STACK = "MyShopS3StaticSiteCdkJavaStack";

    public static void main(final String[] args) {
        var app = new App();

        var pr = StackProps.builder().build();

        new S3StaticSiteCdkJavaStack(app, MY_SHOP_S_3_STATIC_SITE_CDK_JAVA_STACK,pr);

        app.synth();
    }
}

