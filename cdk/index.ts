import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StaticSiteConstruct } from "./StaticSiteConstruct";

class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new StaticSiteConstruct(this, "StaticSiteConstruct");
  }
}

new StaticSiteStack(new cdk.App(), "StaticSiteStack");
