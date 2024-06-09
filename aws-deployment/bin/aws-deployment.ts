#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsDeploymentStack } from '../lib/aws-deployment-stack';

const app = new cdk.App();
new AwsDeploymentStack(app, 'AwsDeploymentStack', {

});