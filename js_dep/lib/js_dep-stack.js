const { Stack, RemovalPolicy } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const { PolicyStatement, ServicePrincipal } = require('aws-cdk-lib/aws-iam');
const s3deploy = require('aws-cdk-lib/aws-s3-deployment');
const path = require('path');

class JsDepStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

   const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, 
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      });

   const oai = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for siteBucket',
    });

    const distrebution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistrebution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity: oai,
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
          rootObject: 'index.html',
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });


    siteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
      conditions: {
        StringLike: { 'aws:Referer': `http*://${distrebution.distributionDomainName}/*` },
      },   
    }));

    siteBucket.grantRead(oai);

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: siteBucket,
      distribution: distrebution,
      distributionPaths: ['/*'],
    });

  }
}

module.exports = { JsDepStack }
