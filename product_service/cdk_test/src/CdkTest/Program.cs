using Amazon.CDK;

namespace Cdk
{
    sealed class Program
    {
        public static void Main(string[] args)
        {
            var app = new App();
            new CdkStack(app, "CdkStack", new StackProps
            {
                // For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html

                Env = new Environment
                {
                    Account = "851725229611",
                    Region = "us-east-1",
                }
            });
            app.Synth();
        }
    }
}