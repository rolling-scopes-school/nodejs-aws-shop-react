import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeploymentService } from "./deploy-service";

export class AwsShopDeploy extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DeploymentService(this, "deployment");
  }
}
