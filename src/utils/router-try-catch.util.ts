import {NextFunction, Request, Response} from 'express';
import {HttpStatusCodes} from '../constants';

/**
 * RouterTryCatch - catch errors from middlewares or controllers.
 * @param controller - the controller/middleware function to catch errors.
 * Sends the encountered error to next function to handle it.
 * HttpErrors.throw middleware will catch error/s thrown here.
 * @returns Promise<void>
 */
export const RouterTryCatch = (controller: Function) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // execute the controller method call
      const response = await controller(req, res, next);
      if (response) {
        res.status(response.status || HttpStatusCodes.OK).send(response);
      }
    } catch (error) {
      // send error to next function that handles errors
      next(error);
    }
  };
};
