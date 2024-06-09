import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Task02 } from "../construct/task02";

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * This stack relies on getting the domain name from CDK context.
     * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
     * Or add the following to cdk.json:
     * {
     *   "context": {
     *     "domain": "mystaticsite.com",
     *     "subdomain": "www",
     *     "accountId": "1234567890",
     *   }
     * }
     **/
    new Task02(this, "StaticSite");
  }
}
