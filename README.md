## Serverless VPC Examples

This repository contains example configuration for using a Lambda function inside a VPC. It also shows two different methods for using AWS services from a Lambda function in a VPC.

The two methods are:

- [**Using a NAT Gateway**](./nat-gateway/README.md): Adding a [NAT Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) provides full public internet access to your Lambda function. A NAT Gateway costs ~$35 per month per instance plus data processing charges.
- [**Using a VPC Endpoint**](./vpc-endpoint/README.md): A [VPC endpoint](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html) allows you to use a specific AWS service from within a VPC. A VPC endpoint costs ~$7.50 per month plus data processing charges.

Check out the accompanying blog post on [using AWS services from a Lambda inside a VPC](https://www.alexdebrie.com/posts/aws-lambda-vpc/) for a larger breakdown of the pros and cons of the two approaches.