import {NextFunction, Request, Response} from 'express';
import {LoggerService} from './logger.service';
import {AnyData} from '../types';
import {LoggerName} from '../constants';

const httpLogger = new LoggerService(LoggerName.HTTP_LOGGER_SERVICE);

/**
 * HttpLogsService - intercepts request and response to foramt logs of each request and response
 * to the console
 */
export class HttpLogsService {
  public static log(req: Request, res: Response, next: NextFunction) {
    /*get response data*/
    const oldWrite = res.write;
    const oldEnd = res.end;
    const startTime = Date.now();

    const responseData: AnyData[] | Uint8Array[] = [];

    res.write = function (chunk) {
      responseData.push(chunk);
      return oldWrite.call(res, chunk, 'utf8');
    };

    res.end = (chunk): AnyData => {
      if (chunk) responseData.push(chunk);
      // writes original response back
      oldEnd.apply(res, <AnyData>responseData);

      const responseTime = Date.now() - startTime;
      const {method: rawMethod, url} = req;
      const method = rawMethod.toUpperCase();
      const ip =
        req.header('x-forwarded-for') || req.ip || req.connection.remoteAddress;
      const {statusCode, statusMessage} = res;
      const contentLength = responseData?.toString()?.length ?? 0;
      const logMessage = `${method.toUpperCase()} ${url} [ip]:${ip} [time]:${responseTime}ms [len]:${contentLength} - ${statusCode}-${statusMessage}`;

      if (statusCode >= 400 && statusCode <= 499) {
        // 400 - Bad Request
        // 499 - Client closed the connection before the server respond to request.
        httpLogger.warn(logMessage);
      } else if (statusCode >= 500) {
        // 500 - Server encountered an unexpected condition that prevented it from fulfilling the request
        httpLogger.error(logMessage);
      } else {
        // Unkown error
        httpLogger.info(logMessage);
      }
    };

    next();
  }
}
