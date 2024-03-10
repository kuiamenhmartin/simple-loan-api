import sinon from 'sinon';
import {RouterTryCatch} from '../../../utils';
import {AnyData} from '../../../types';
import {HttpStatusCodes} from '../../../constants';

describe('RouterTryCatch Util (unit)', () => {
  const mockRequest = {method: 'get', path: '/api/loans'};
  const mockResponse = {status: sinon.stub().returnsThis(), send: sinon.stub()};
  const nextFunction = sinon.stub();
  const mockResponseData = {
    status: HttpStatusCodes.OK,
    success: true,
    message: 'Success',
    code: 'SUCCESS',
  };

  it('should test router try catch middleware', async () => {
    // mock controller with 200 0K response
    let mockController = async () => Promise.resolve(mockResponseData);
    // test case when controller response a success
    await RouterTryCatch(mockController)(
      mockRequest as AnyData,
      mockResponse as AnyData,
      nextFunction
    );
    sinon.assert.calledWith(mockResponse.status, HttpStatusCodes.OK);
    sinon.assert.calledWithMatch(mockResponse.send, mockResponseData);

    // mock controller with error response
    mockController = async () =>
      Promise.reject(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    // test case when controller response a success
    await RouterTryCatch(mockController)(
      mockRequest as AnyData,
      mockResponse as AnyData,
      nextFunction
    );
    sinon.assert.calledWith(
      nextFunction,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );

    // mock controller response with undefined response
    mockController = async () => Promise.resolve(undefined as AnyData);
    // test case when controller response is undefined
    await RouterTryCatch(mockController)(
      mockRequest as AnyData,
      mockResponse as AnyData,
      nextFunction
    );

    // mock controller response with undefined status
    mockController = async () =>
      Promise.resolve({
        status: undefined,
      } as AnyData);
    // test case when controller response status is undefined
    await RouterTryCatch(mockController)(
      mockRequest as AnyData,
      mockResponse as AnyData,
      nextFunction
    );
  });
});
