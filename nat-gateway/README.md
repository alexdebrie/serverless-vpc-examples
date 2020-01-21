## Lambda in VPC -- NAT Gateway example

This Serverless service shows how to configure a Lambda function in a VPC with public internet access by using a NAT Gateway. It will configure all necessary VPC resources and deploy a Lambda function in the VPC. The VPC will demonstrate that it has internet access by using [Amazon SNS](https://aws.amazon.com/sns) to send an SMS message.

### Usage

To use this example, run the following steps. You must have the [Serverless Framework](https://github.com/serverless/serverless) installed.

1. Create a new service from this repository and install the dependencies.

    ```bash
    serverless create --template-url https://github.com/alexdebrie/serverless-vpc-examples/tree/master/nat-gateway --path nat-gateway
    cd nat-gateway
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
- Two public [subnets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html) and two private subnets. The Lambda functions will use the private subnets, but the NAT Gateways will be in the public subnets.
- An [Internet Gateway](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-internetgateway.html) and a [VPC Gateway Attachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html) to connect the Gateway to the VPC. The Internet Gateway will allow public internet access for the public subnets.
- [RouteTables](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route-table.html) and [Subnet Route Table Associations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet-route-table-assoc.html) to associate each subnet with a route table.
- [Routes](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html) in the public subnet route tables that direct traffic through the Internet Gateway.
- Two [Elastic IP Addresses](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-eip.html) that will be assigned to our NAT Gateways.
- Two [NAT Gateways](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-natgateway.html) that will be used to connect our private subnets to the public internet.
- [Routes](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html) in the private subnet route tables to route traffic through the NAT Gateways.
- A [Security Group](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html) to give to our Lambda function.

The general architecture is as follows:

![Lambda in VPC with NAT Gateway](https://user-images.githubusercontent.com/6509926/72752984-46a50680-3b89-11ea-93ed-3702afb64242.png)

Our Lambda functions are (functionally) in the private subnets of our VPC. Their web requests are routed through the NAT Gateway into the public subnet where the traffic can go through the internet gateway to the public internet. With public internet access, our Lambda function has access AWS services like SNS.

In our Lambda function configuration, we use the private subnet IDs and the security group ID to configure our Lambda function to be in a VPC.

This is a lot of resources and can be quite confusing if you're not a networking wizard. Both the VPC resources and the Lambda function are combined in this example stack for ease of demonstration. For production use cases, I would recommend splitting the VPC configuration into a different CloudFormation stack altogether. You could refer to the exported values from that stack in your Serverless service.