import {NextFunction, Request, Response} from 'express';
import {LoggerService} from '../services';
import {HttpStatus, HttpStatusCodes, LoggerName} from '../constants';
import {AnyZodObject, ZodError, z} from 'zod';
import {AnyData} from '../types';

// Utility function to access nested properties based on an array of keys
function getNestedValue<T>(obj: T, keys: string[]): AnyData {
  return keys.reduce((acc, key) => {
    return (acc as AnyData)[key as AnyData];
  }, obj);
}

/**
 * ValidatorMiddleware - catch input validation errors before passing data to the target route
 * @param req express Request
 * @param res express Response
 * @param next express NextFunction
 *
 */
export function ValidatorMiddleware(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const log = new LoggerService(LoggerName.VALIDATION_MIDDLEWARE);
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map over issues to generate a more specific validaton error
        const errorMessages = error.errors.map(
          (issue: z.ZodIssue | AnyData) => ({
            value: getNestedValue(
              req[issue.path[0] as keyof Request],
              issue.path.slice(1) as string[]
            ),
            type: issue.type,
            msg: issue.message,
            path:
              issue.path.length > 1
                ? issue.path.slice(1).join('.')
                : issue.path.join('.'),
            location: issue.path[0],
          })
        );

        // log validation error as warning
        log.warn({errorMessages});
        res.status(HttpStatusCodes.BAD_REQUEST).send({
          status: HttpStatusCodes.BAD_REQUEST,
          success: false,
          message: 'Please check your inputs',
          data: errorMessages,
          code: HttpStatus.BAD_REQUEST,
        });
      } else {
        log.warn({error});
        next(error);
      }
    }
  };
}
