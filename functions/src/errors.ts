/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpsError } from 'firebase-functions/v1/auth';
import { ValidationError } from 'joi';

/**
 * Error codes recognized by our application.
 *
 * @see {@link https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode | FunctionsErrorCode} to add new error codes
 */
export type ApplicationErrorCode =
  | 'invalid-argument'
  | 'not-found'
  | 'already-exists'
  | 'unauthenticated'
  | 'permission-denied';

export type ApiError = {
  code: number;
  errors: { message: string; domain: string; reason: string }[];
};

/**
 * An error that can be thrown by our application. Serves as an interface between an `Error` and a `HttpsError`.
 */
export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;

  constructor(code: ApplicationErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApplicationError';
  }
}

export function isApplicationError(error: any): error is ApplicationError {
  return error.name !== undefined && error.name === 'ApplicationError';
}

export function isApiError(error: any): error is ApiError {
  return error.code !== undefined && error.errors !== undefined && Array.isArray(error.errors);
}

export function isHttpsError(error: any): error is HttpsError {
  return error.code !== undefined && error.httpErrorCode !== undefined;
}

export function isJoiError(error: any): error is ValidationError {
  return error.name !== undefined && error.name === 'ValidationError' && error.isJoi === true;
}

/**
 * Handles an error by converting it to a `HttpsError` if it is not already one.
 * @param {any} error The error received by the try/catch block.
 * @return {HttpsError} A `HttpsError` that can be thrown to the client.
 */
export function handleError(error: any): HttpsError {
  console.log(error);

  if (isApplicationError(error)) {
    return new HttpsError(error.code, error.message);
  }

  if (isHttpsError(error)) {
    return error;
  }

  if (isJoiError(error)) {
    return new HttpsError('invalid-argument', 'invalidArgument', JSON.stringify(error.details));
  }

  return new HttpsError('internal', 'unexpected');
}
