#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-cdk-stack';

const app = new cdk.App();
new FrontendStack(app, 'FrontendStackCDK2');
