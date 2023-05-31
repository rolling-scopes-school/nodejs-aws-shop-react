import { Stack, App } from 'aws-cdk-lib';
import { StaticSite } from './statis-site';

class TechableStaticSiteStack extends Stack {
  constructor(parent: App, name: string) {
    super(parent, name);

    new StaticSite(this, 'TechableWebsite');
  }
}

const app = new App();

new TechableStaticSiteStack(app, 'TechableStaticSiteStack');

app.synth();
