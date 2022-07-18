import type { AWS } from '@serverless/typescript'

import * as functions from '@functions'

const serverlessConfiguration: AWS = {
  service: 'serverless-front-back-template',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-stack-output'],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    stage: '${opt:stage, "dev"}',
    frontendDeploymentBucketName: '${self:service}-${self:custom.stage}-frontend-deployment',
    output: {
      file: 'src/frontend/src/config/backendDeploymentInfo.json'
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-2',
    stage: '${self:custom.stage}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { ...functions },
  package: {
    individually: true,
    exclude: [
      'src/frontend'
    ],
  },
  resources: {
    Resources: {
      FrontEndDeploymentBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.frontendDeploymentBucketName}',
          AccessControl: 'PublicRead',
          WebsiteConfiguration: {
            IndexDocument: 'index.html',
            ErrorDocument: 'index.html',
          },
          CorsConfiguration: {
            CorsRules: [
              {
                Id: 'allowCors',
                MaxAge: 3600,
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
                AllowedOrigins: ['*'],
              }
            ]
          }
        },
      },
      S3AccessPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'FrontEndDeploymentBucket'
          },
          PolicyDocument: {
            Statement: [{
              Sid: 'PublicReadGetObject',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: 'arn:aws:s3:::${self:custom.frontendDeploymentBucketName}/*',
            }],
          },
        },
      },
    },
    Outputs: {
      S3FrontendDeploymentBucket: {
        Description: 'Frontend Deployment Bucket Name',
        Value: {
          'Ref': 'FrontEndDeploymentBucket'
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
