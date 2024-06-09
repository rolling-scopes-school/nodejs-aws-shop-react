const { 
  Stack, 
  RemovalPolicy , 
  aws_cloudfront, 
  aws_cloudfront_origins,
  aws_iam,
  aws_s3_deployment
} = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
// const sqs = require('aws-cdk-lib/aws-sqs');

class CdkJsStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const site_bucket = new s3.Bucket(this, 'rs-module2-mariiaya',
      {
        removalPolicy: RemovalPolicy.DESTROY,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        autoDeleteObjects: true
      }
    );

    const oai = new aws_cloudfront.OriginAccessIdentity(this, 'OAI_new', {
      comment: 'OAI for my distribution'
    });

    const distribution = new aws_cloudfront.Distribution(this, 'MyStaticSiteDistribution', {
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(site_bucket, {
          originAccessIdentity: oai
        }),
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      defaultRootObject: 'index.html'
    });

    site_bucket.addToResourcePolicy(new aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [site_bucket.arnForObjects('*')],
      principals: [new aws_iam.ServicePrincipal('cloudfront.amazonaws.com')],
      conditions: {
        StringEquals: {
          ['AWS:SourceArn']: `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`
        }
      }
    }));

    site_bucket.grantRead(oai);

    new aws_s3_deployment.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [aws_s3_deployment.Source.asset('../dist')],
      destinationBucket: site_bucket,
      distribution: distribution,
      distributionPaths: ['/*']
    });

    // example resource
    // const queue = new sqs.Queue(this, 'CdkJsQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { CdkJsStack }
