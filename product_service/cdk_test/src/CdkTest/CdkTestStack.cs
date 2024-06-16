
using Amazon.CDK;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.APIGateway;
using Constructs;
using Function = Amazon.CDK.AWS.Lambda.Function;
using FunctionProps = Amazon.CDK.AWS.Lambda.FunctionProps;

namespace Cdk
{
    public class CdkStack : Stack
    {
        private const string BackendPath = "product_service";
        private const string LambdaPath = "lambdas";
        private readonly string[] _allowMethods = { "GET", "OPTIONS" };
        private readonly string[] _allowHeaders =
            { "Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token" };

        internal CdkStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // Create Lambda function for getProductsList
            var getProductsListFunction = new Function(this, "GetProductsListFunction", new FunctionProps
            {
                Runtime = Runtime.NODEJS_18_X,
                Handler = "getProductsList.handler",
                Code = Code.FromAsset($"../../{BackendPath}/{LambdaPath}"),
            });

            // Create Lambda function for getProductsById
            var getProductsByIdFunction = new Function(this, "GetProductsByIdFunction", new FunctionProps
            {
                Runtime = Runtime.NODEJS_18_X,
                Handler = "getProductsById.handler",
                Code = Code.FromAsset($"../../{BackendPath}/{LambdaPath}")
            });

            // Create API Gateway with CORS preflight options
            var api = new RestApi(this, "ProductApi", new RestApiProps
            {
                RestApiName = "Product Service",
                DefaultCorsPreflightOptions = new CorsOptions
                {
                    AllowOrigins = GetAllowOrigins(),
                    AllowMethods = _allowMethods,
                    AllowHeaders = _allowHeaders
                }
            });

            // Integrate getProductsListFunction with API Gateway
            var productsResource = api.Root.AddResource("products");
            var getProductsListIntegration = new LambdaIntegration(getProductsListFunction);
            productsResource.AddMethod("GET", getProductsListIntegration);

            // Ensure CORS preflight is only added once
            if (productsResource.DefaultCorsPreflightOptions == null)
            {
                productsResource.AddCorsPreflight(new CorsOptions
                {
                    AllowOrigins = GetAllowOrigins(),
                    AllowMethods = _allowMethods,
                    AllowHeaders = _allowHeaders
                });
            }

            // Integrate getProductsByIdFunction with API Gateway
            var productByIdResource = productsResource.AddResource("{productId}");
            var getProductsByIdIntegration = new LambdaIntegration(getProductsByIdFunction);
            productByIdResource.AddMethod("GET", getProductsByIdIntegration);

            // Ensure CORS preflight is only added once
            if (productByIdResource.DefaultCorsPreflightOptions == null)
            {
                productByIdResource.AddCorsPreflight(new CorsOptions
                {
                    AllowOrigins = GetAllowOrigins(),
                    AllowMethods = _allowMethods,
                    AllowHeaders = _allowHeaders
                });
            }
        }

        private static string[] GetAllowOrigins()
        {
            //const string localUrl = "http://localhost:3000";
            //const string docsUrl = "http://localhost:3000/api-docs";
            return new[]
            {
                //localUrl, docsUrl, $"https://{}"
                "*"
            };
        }
    }
}