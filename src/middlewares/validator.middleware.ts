import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { LoggerService } from "../services";
import { HttpStatus, HttpStatusCodes, LoggerName } from "../constants";

/**
 * ValidatorMiddleware - catch input validation errors before passing data to the target route
 * @param req express Request
 * @param res express Response
 * @param next express NextFunction
 * 
 */
export const ValidatorMiddleware =  (req: Request, res: Response, next: NextFunction) => {

    const log = new LoggerService(LoggerName.VALIDATION_MIDDLEWARE);
    const result = validationResult(req);

    if(!result.isEmpty()) {
        // get validation errors from express-validation middleware
        const validationErrors = result.array();

        // log validation error as warning
        log.warn({validationErrors});

        // send validation error response
        res.status(HttpStatusCodes.BAD_REQUEST).send({
            status: HttpStatusCodes.BAD_REQUEST,
            success: false,
            message: 'Please check your inputs',
            data: validationErrors,
            code: HttpStatus.BAD_REQUEST,
        });
    } else {
        // continue on next middleware
        next();
    }
}