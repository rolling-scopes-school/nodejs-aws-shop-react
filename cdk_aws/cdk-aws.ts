import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import {StaticSite} from "./static-site";

const app = new cdk.App();

new StaticSite(app,
    "MyJSCCStaticWebsite", {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
        },
    });

app.synth();