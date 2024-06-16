#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { CdkDeploymentStack } from '../lib/cdk-deployment-stack';
import { region } from '../constants';

const app = new cdk.App();
new CdkDeploymentStack(app, 'CdkDeploymentStack', {
  env: { region },
});