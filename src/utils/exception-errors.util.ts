import {HttpStatus, HttpStatusCodes} from '../constants';

/**
 * ResourceNotFoundExceptionError
 * - extends the Error object and added extra props
 * - this error can be used as exception error
 */
export class ResourceNotFoundExceptionError extends Error {
  statusCode: number;
  code: string;
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.NOT_FOUND;
    this.code = HttpStatus.NOT_FOUND;
  }
}

/**
 * ServiceUnavailableExceptionError
 * - extends the Error object and added extra props
 * - this error can be used as exception error
 */
export class ServiceUnavailableExceptionError extends Error {
  statusCode: number;
  code: string;
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.SERVICE_UNAVAILABLE;
    this.code = HttpStatus.SERVICE_UNAVAILABLE;
  }
}
