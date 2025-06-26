// import { HttpException, HttpStatus } from '@nestjs/common';
// import { RepositoryException } from './src/modules/order/shared/exceptions/repository.exception';

// export function errorBoundary<Class extends any>(error: any, className: Class) {
//   if (error instanceof RepositoryException) {
//     throw new HttpException(
//       JSON.stringify({
//         type: 'Repository Exception',
//         origin: className?.name,
//       }),
//       HttpStatus.BAD_REQUEST,
//     );
//   }
// }

// TODO: fazer algo tipo isso, mas mapeando minhas custom exceptions e lancando as execoes de forma correta

// import { AbstractHttpAdapter } from '@nestjs/core'

// import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common'
// import {
//   PrismaClientRustPanicError,
//   PrismaClientValidationError,
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientInitializationError
// } from '@prisma/client/runtime/library'

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}
//   catch(exception: FastifyError, host: ArgumentsHost): void {
//     let errorMessage: unknown
//     let httpStatus: number
//     const httpAdapter = this.httpAdapterHost
//     const ctx = host.switchToHttp()
//     if (exception instanceof PrismaClientRustPanicError) {
//       httpStatus = 400
//       errorMessage = exception.message
//     } else if (exception instanceof PrismaClientValidationError) {
//       httpStatus = 422
//       errorMessage = exception.message
//     } else if (exception instanceof PrismaClientKnownRequestError) {
//       httpStatus = 400
//       errorMessage = exception.message
//     } else if (exception instanceof PrismaClientUnknownRequestError) {
//       httpStatus = 400
//       errorMessage = exception.message
//     } else if (exception instanceof PrismaClientInitializationError) {
//       httpStatus = 400
//       errorMessage = exception.message
//     } else if (
//       exception.statusCode &&
//       exception.statusCode >= 400 &&
//       exception.statusCode <= 499
//     ) {
//       httpStatus = exception.statusCode
//       errorMessage = exception.message
//     } else {
//       httpStatus = 500
//       errorMessage = [
//         'Sorry! something went to wrong on our end, Please try again later'
//       ]
//     }
//     const errorResponse = {
//       errors: typeof errorMessage === 'string' ? [errorMessage] : errorMessage
//     }
//     httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus)
//   }
// }
