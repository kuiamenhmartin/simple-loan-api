import {AnyData} from '../types';

/**
 * safeJsonParse - safely parsed stringified json
 * @param str - the string to parse
 * @param defaultVal - the default value if string is null or an error occurs
 * @returns any - the data parsed
 */
export const safeJsonParse = (str = '', defaultVal: AnyData): AnyData => {
  let parseJson: AnyData;
  try {
    parseJson = JSON.parse(str);
  } catch (err) {
    parseJson = defaultVal;
  }
  return parseJson;
};
