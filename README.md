# Serverless - AWS Node.js FullStack Typescript Template

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/) and using the `typescript` template from [create-react-app](https://github.com/facebook/create-react-app).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls first-deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls first-deploy` to deploy this stack to AWS

> **Important**: `first-deploy` is only required the first deployment or whenever you are going to create a new AWS CloudFormation Stack because you will need the API Gateway endpoint deployment variable before the frontend deployment

After the first deployment, you can deploy by using:

- Run `npx sls first-deploy`
- Run `yarn sls first-deploy`

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/hello` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by API Gateway against `src/functions/hello/schema.ts` JSON-Schema definition: it must contain the `name` property.

- requesting any other path than `/hello` with any other method than `POST` will result in API Gateway returning a `403` HTTP error code
- sending a `POST` request to `/hello` with a payload **not** containing a string property named `name` will result in API Gateway returning a `400` HTTP error code
- sending a `POST` request to `/hello` with a payload containing a string property named `name` will result in API Gateway returning a `200` HTTP status code with a message saluting the provided name and the detailed event processed by the lambda

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f hello --path src/functions/hello/mock.json` if you're using NPM
- `yarn sls invoke local -f hello --path src/functions/hello/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `domain` - containing code base for the backend business logic and models
- `frontend` - containing code base for the frontend single page application
- `infra` - containing specific code for backend infrastructure pieces

```
.
├── src
│   ├── backend
│   │   ├── domain                         # Domain layer source code folder
│   │   └── infra                          # All infrastructure pieces of code
│   │       ├── aws                        
│   │       │   └── api-gateway            # API Gateway specific helpers folder
│   │       ├── express                    
│   │       │   └── main.js                # ExpressJS backend server for local environment integration purpose (will NOT be deployed)    
│   │       └── functions
│   │           ├── hello
│   │           │   ├── handler.ts         # `Hello` lambda source code
│   │           │   ├── index.ts           # `Hello` lambda Serverless configuration
│   │           │   ├── mock.json          # `Hello` lambda input parameter, if any, for local invocation
│   │           │   └── schema.ts          # `Hello` lambda input event JSON-Schema
│   │           ├── handler-resolver.ts    # Sharable library for resolving lambda handlers
│   │           └── index.ts               # Import/export of all lambda configurations        
│   └── frontend                           # Create-React-App frontend code folder
├── package.json                                                              
├── serverless.ts                          # Serverless service file          
├── tsconfig.json                          # Typescript compiler configuration
└── tsconfig.paths.json                    # Typescript paths                 
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object. Also [http-cors](https://github.com/middyjs/middy/tree/main/packages/http-cors) is used to simplify the cors configuration on API Gateway handlers and [http-content-encoding](https://github.com/middyjs/middy/tree/main/packages/http-content-encoding) to minify the response amount of bytes 
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
- [Express](https://github.com/expressjs/express) - backend server framework to simplify local environment development and integration manual test (avoid deploying the backend to AWS in order to do this kind of testing)
- [serverless-s3-sync](https://github.com/k1LoW/serverless-s3-sync) - serverless framework plugin to deploy the frontend to a specific bucket
- [serverless-stack-output](https://github.com/sbstjn/serverless-stack-output) - serverless framework plugin to parse the serverless deploy stack outputs and use the file to use it as configuration variables (mainly for API Gateway base url endpoint)

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
