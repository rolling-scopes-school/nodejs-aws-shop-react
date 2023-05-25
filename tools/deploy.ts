#!/usr/bin/env node
import {App, Stack} from 'aws-cdk-lib';
import {StaticSite} from "./static-site";


export class MyStaticSiteStack extends Stack {
    constructor(parent: App, name: string) {
        super(parent, name);

        new StaticSite(this, 'SkreepatchStaticWebsite');
    }
}

const app = new App();
new MyStaticSiteStack(app, 'MySkreepatchStaticWebsite')
app.synth();
