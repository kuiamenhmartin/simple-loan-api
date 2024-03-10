import * as crypto from 'crypto';
import {RandomKeyLength} from '../constants';

/**
 * Generate random hexadecimal string to be a unique id
 * @returns random hexadecimal string
 */
export const generateRandomKey = (): string => {
  return crypto.randomBytes(RandomKeyLength).toString('hex');
};
