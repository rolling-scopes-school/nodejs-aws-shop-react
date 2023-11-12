import * as cdk from "aws-cdk-lib";
import { SiteStack } from "./site-stack";

const app = new cdk.App();
new SiteStack(app, "SiteStack");
