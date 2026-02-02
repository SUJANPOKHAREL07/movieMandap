declare module 'graphql-upload' {
  import { GraphQLScalarType } from 'graphql';
  import { RequestHandler } from 'express';

  export const GraphQLUpload: GraphQLScalarType;

  export function graphqlUploadExpress(options?: {
    maxFileSize?: number;
    maxFiles?: number;
  }): RequestHandler;
}
