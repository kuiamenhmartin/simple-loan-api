import * as crypto from 'crypto';
import { RandomKeyLength } from '../constants';

/**
 * Generate random string as unique id
 * @returns random hexadecimal string
 */
export const generateRandomKey = (): string => {
  return crypto.randomBytes(RandomKeyLength).toString('hex');
}