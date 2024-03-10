import {expect} from 'chai';
import {safeJsonParse} from '../../../utils';
import {AnyData} from '../../../types';

describe('SafeJsonParse Util (unit)', () => {
  it('should return parsed json string using <safeJsonParse>', async () => {
    // test case with array as input to be parsed
    let response = safeJsonParse('[]', []);
    expect(response).to.be.not.undefined;

    // test case using undefined as input to be parsed
    response = safeJsonParse(undefined as AnyData, {});
    expect(response).to.be.not.undefined;
  });

  it('should return defaultValue using <safeJsonParse>', async () => {
    const response = safeJsonParse('0:{}', []);
    expect(response).to.be.not.undefined;
  });
});
