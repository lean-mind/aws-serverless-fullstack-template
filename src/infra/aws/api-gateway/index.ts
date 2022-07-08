import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import httpContentEncoding from "@middy/http-content-encoding";
import cors from "@middy/http-cors";


type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(httpContentEncoding())
    .use(cors())
}

const Response = (statusCode: number, body: any = {}, headers: any = {}) => {
  return {
    statusCode,
    body: JSON.stringify(body, null, 2),
    headers,
  }
}

export const Ok = (body: any = {}, headers: any = {}) => Response(200, body, headers)
export const NoContent = (body: any = {}, headers: any = {}) => Response(201, body, headers)
export const BadRequest = (body: any = {}, headers: any = {}) => Response(400, body, headers)
export const NotFound = (body: any = {}, headers: any = {}) => Response(404, body, headers)
export const InternalError = (body: any = {}, headers: any = {}) => Response(500, body, headers)
