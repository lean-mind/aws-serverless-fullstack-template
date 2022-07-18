import type { ValidatedEventAPIGatewayProxyEvent } from '@aws/api-gateway';
import { middyfy, Ok } from '@aws/api-gateway';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return Ok({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
  });
};

export const main = middyfy(hello);
