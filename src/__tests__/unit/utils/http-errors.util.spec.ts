import sinon from 'sinon';
import {expect} from 'chai';
import {HttpError, HttpErrors} from '../../../utils';
import {HttpStatus, HttpStatusCodes} from '../../../constants';
import {LoggerService} from '../../../services';
import {Request, Response} from 'express';

describe('Http-Errors Util (unit)', () => {
  const testSandbox = sinon.createSandbox();
  let loggerServiceStub: sinon.SinonStubbedInstance<LoggerService>;

  beforeEach(async () => {
    loggerServiceStub = testSandbox.stub(LoggerService.prototype);
    const fakeFunc = () => {};
    loggerServiceStub.error.callsFake(fakeFunc);
    loggerServiceStub.warn.callsFake(fakeFunc);
  });

  afterEach(() => {
    testSandbox.restore();
  });

  it('test case throw middleware', () => {
    const mockRequest = {
      method: 'get',
      path: '/api/loans',
    } as Request;
    const mockResponse = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const nextFunction = sinon.stub();
    let httpError = new HttpError(
      'Custom Error',
      HttpStatusCodes.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );

    // test case when error is undefined
    HttpErrors.Throw(
      undefined as unknown as HttpError,
      mockRequest,
      mockResponse as unknown as Response,
      nextFunction
    );
    sinon.assert.calledWith(
      mockResponse.status,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
    sinon.assert.calledWithMatch(mockResponse.send, {
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal Server Error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    // test case when error is not null
    HttpErrors.Throw(
      httpError,
      mockRequest,
      mockResponse as unknown as Response,
      nextFunction
    );
    sinon.assert.calledWith(mockResponse.status, HttpStatusCodes.BAD_REQUEST);
    sinon.assert.calledWithMatch(mockResponse.send, {
      status: HttpStatusCodes.BAD_REQUEST,
      success: false,
      message: 'Custom Error',
      code: HttpStatus.BAD_REQUEST,
    });

    // test case when error is not found
    httpError = new HttpError(
      'Custom Error',
      HttpStatusCodes.SERVICE_UNAVAILABLE,
      HttpStatus.SERVICE_UNAVAILABLE
    );
    HttpErrors.Throw(
      httpError,
      mockRequest,
      mockResponse as unknown as Response,
      nextFunction
    );
    sinon.assert.calledWith(
      mockResponse.status,
      HttpStatusCodes.SERVICE_UNAVAILABLE
    );
    sinon.assert.calledWithMatch(mockResponse.send, {
      status: HttpStatusCodes.SERVICE_UNAVAILABLE,
      success: false,
      message: 'Custom Error',
      code: HttpStatus.SERVICE_UNAVAILABLE,
    });

    // test case when error is not among the listed http errors
    httpError = new HttpError(
      'NotFound',
      HttpStatusCodes.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
    HttpErrors.Throw(
      httpError,
      mockRequest,
      mockResponse as unknown as Response,
      nextFunction
    );
    sinon.assert.calledWith(mockResponse.status, HttpStatusCodes.NOT_FOUND);
    sinon.assert.calledWithMatch(mockResponse.send, {
      status: HttpStatusCodes.NOT_FOUND,
      success: false,
      message: 'Cannot GET endpoint: /api/loans',
      code: HttpStatus.NOT_FOUND,
    });

    // test case when error status code not provided
    httpError = new HttpError('Unkown error');
    HttpErrors.Throw(
      httpError,
      mockRequest,
      mockResponse as unknown as Response,
      nextFunction
    );
    sinon.assert.calledWith(
      mockResponse.status,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
    sinon.assert.calledWithMatch(mockResponse.send, {
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal Server Error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('test case http-error using default error', () => {
    const errMsg = 'Test error';
    const httpError = new HttpError(errMsg);

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError).to.be.an.instanceOf(Error);
    expect(httpError.message).to.equal(errMsg);
    // Default status code
    expect(httpError.statusCode).to.equal(
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
    // Default error code
    expect(httpError.code).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('test case http-errors using bad request error', () => {
    const errMsg = 'BadRequest';
    const httpError = HttpErrors.BadRequest();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(HttpStatusCodes.BAD_REQUEST);
    expect(httpError.code).to.equal(HttpStatus.BAD_REQUEST);
  });

  it('test case http-errors using not found error', () => {
    const errMsg = 'NotFound';
    const httpError = HttpErrors.NotFound();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(HttpStatusCodes.NOT_FOUND);
    expect(httpError.code).to.equal(HttpStatus.NOT_FOUND);
  });

  it('test case http-errors using unauthorized error', () => {
    const errMsg = 'Unauthorized';
    const httpError = HttpErrors.Unauthorized();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(HttpStatusCodes.UNAUTHORIZED);
    expect(httpError.code).to.equal(HttpStatus.UNAUTHORIZED);
  });

  it('test case http-errors using forbidden error', () => {
    const errMsg = 'Forbidden';
    const httpError = HttpErrors.Forbidden();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(HttpStatusCodes.FORBIDDEN);
    expect(httpError.code).to.equal(HttpStatus.FORBIDDEN);
  });

  it('test case http-errors using service unavailable error', () => {
    const errMsg = 'ServiceUnavailable';
    const httpError = HttpErrors.ServiceUnavailable();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(HttpStatusCodes.SERVICE_UNAVAILABLE);
    expect(httpError.code).to.equal(HttpStatus.SERVICE_UNAVAILABLE);
  });

  it('test case http-errors using internal server error', () => {
    const errMsg = 'InternalServerError';
    const httpError = HttpErrors.InternalServerError();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(httpError.code).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('test case http-errors using bad gateway error', () => {
    const errMsg = 'BadGateway';
    const httpError = HttpErrors.BadGateway();

    expect(httpError).to.be.an.instanceOf(HttpError);
    expect(httpError.message).to.equal(errMsg);
    expect(httpError.statusCode).to.equal(HttpStatusCodes.BAD_GATEWAY);
    expect(httpError.code).to.equal(HttpStatus.BAD_GATEWAY);
  });
});
