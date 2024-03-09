import {NextFunction, Request, Response} from 'express';
import {HttpStatus, HttpStatusCodes, LoggerName} from '../constants';
import {LoggerService} from '../services';

/**
 * HttpError - extends the Error object and added extra props to match
 * the needs when throwing Http Errors such as status code.
 * This error is handled by the HttpErrors.throw method.
 */
export class HttpError extends Error {
  statusCode: number;
  code: string;
  constructor(
    message: string,
    status: number = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    code = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = status;
    this.code = code;
  }
}

/**
 * HttpErrors - has publicly available methods to generate Http Errors based on
 * status code
 */
export class HttpErrors {
  /**
   * HttpErrors.BadRequest - throws an Http Error with 400 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static BadRequest(message = 'BadRequest') {
    return new HttpError(
      message,
      HttpStatusCodes.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }

  /**
   * HttpErrors.NotFound - throws an Http Error with 404 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static NotFound(message = 'NotFound') {
    return new HttpError(
      message,
      HttpStatusCodes.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  /**
   * HttpErrors.Unauthorized - throws an Http Error with 401 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static Unauthorized(message = 'Unauthorized') {
    return new HttpError(
      message,
      HttpStatusCodes.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }

  /**
   * HttpErrors.Forbidden - throws an Http Error with 403 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static Forbidden(message = 'Forbidden') {
    return new HttpError(
      message,
      HttpStatusCodes.FORBIDDEN,
      HttpStatus.FORBIDDEN
    );
  }

  /**
   * HttpErrors.ServiceUnavailable - throws an Http Error with 503 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static ServiceUnavailable(message = 'ServiceUnavailable') {
    return new HttpError(
      message,
      HttpStatusCodes.SERVICE_UNAVAILABLE,
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }

  /**
   * HttpErrors.InternalServerError - throws an Http Error with 500 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static InternalServerError(message = 'InternalServerError') {
    return new HttpError(
      message,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  /**
   * HttpErrors.BadGateway - throws an Http Error with 502 Status
   * @param message - the message to throw
   * @returns HttpError
   */
  public static BadGateway(message = 'BadGateway') {
    return new HttpError(
      message,
      HttpStatusCodes.BAD_GATEWAY,
      HttpStatus.BAD_GATEWAY
    );
  }

  /**
   * Throw - handles the throwing of Http Errors
   * @param err - the Http Error to throw
   * @param req - the Express Request Object
   * @param res - the Express Response Object
   * @param _next - the Express Next Function
   */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public static Throw(
    err: HttpError,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    // the custom logger for http errors
    const log = new LoggerService(LoggerName.HTTP_ERRORS);

    // if throws an Error
    if (err) {
      const status = err?.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
      let message =
        status === HttpStatusCodes.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : err.message;
      const success = false;
      const code = err?.code || 'Error';

      // check if an Http Error
      if (
        status === HttpStatusCodes.UNAUTHORIZED ||
        status === HttpStatusCodes.NOT_FOUND ||
        status === HttpStatusCodes.FORBIDDEN ||
        status === HttpStatusCodes.BAD_REQUEST
      ) {
        // generate generic error message for 404 status
        if (status === HttpStatusCodes.NOT_FOUND && message === 'NotFound') {
          message = `Cannot ${req.method.toUpperCase()} endpoint: ${req.path}`;
        }
        log.warn({warn: err});
      } else {
        // normal error was thrown
        log.error({error: err});
      }

      // send the error message as response
      res.status(status).send({
        status,
        success,
        message,
        code,
      });
    } else {
      // the error is unknown or status code is not from known status codes
      log.error({error: err});
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal Server Error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
