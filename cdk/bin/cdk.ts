import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebsiteStack } from "../lib/cdk-stack";

const app = new cdk.App();
new WebsiteStack(app, "WebsiteStack");
