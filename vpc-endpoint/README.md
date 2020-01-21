## Lambda in VPC -- VPC endpoint example

This Serverless service shows how to configure a Lambda function in a VPC to use AWS services by using a [VPC endpoint](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html). It will configure all necessary VPC resources and deploy a Lambda function in the VPC. This example uses [Amazon SNS](https://aws.amazon.com/sns), but it will work with any of the [services that use support VPC endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html). The VPC will demonstrate that the VPC endpoint works by using SNS to send an SMS message.

### Usage

To use this example, run the following steps. You must have the [Serverless Framework](https://github.com/serverless/serverless) installed.

1. Create a new service from this repository and install the dependencies.

    ```bash
    serverless create --template-url https://github.com/alexdebrie/serverless-vpc-examples/tree/master/vpc-endpoint --path vpc-endpoint
    cd vpc-endpoint
    npm i
    ```

2. Update the `SMS_NUMBER` environment variable in the `serverless.yml` file to use the SMS number where you want to send a message.

3. Deploy your service.

    In your terminal, run:

    ```bash
    serverless deploy
    ```

    This will take a few minutes to provision the VPC resources.

4. Invoke your function to send the SMS message.

    In your terminal, run:

    ```bash
    serverless invoke -f sendText
    ```

    You should receive an SMS message to the number provided.

### Explanation

The `serverless.yml` file is creating the following resources:

- A [VPC](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html);
- Two private [subnets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html). The Lambda functions will use the private subnets.
- A [Security Group](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html) to give to our Lambda function.
- A Security Group for our VPC Endpoint. This security group will allow TCP ingress on port 443 (HTTPS) from our Lambda's security group.
- A [VPC endpoint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpcendpoint.html) in our private subnets that is routing to SNS.

The general architecture is as follows:

![Lambda in VPC with VPC Endpoint](https://user-images.githubusercontent.com/6509926/72752985-46a50680-3b89-11ea-891d-5a4a2996fb56.png)

Our Lambda functions are (functionally) in the private subnets of our VPC. The SNS requests are routed through the configured VPC endpoints to the SNS service.

In our Lambda function configuration, we use the private subnet IDs and the security group ID to configure our Lambda function to be in a VPC.

Both the VPC resources and the Lambda function are combined in this example stack for ease of demonstration. For production use cases, I would recommend splitting the VPC configuration into a different CloudFormation stack altogether. You could refer to the exported values from that stack in your Serverless service.