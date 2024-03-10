import {HttpStatusCodes} from '../constants';

export type ResponseType<T = never> = {
  status: HttpStatusCodes;
  success: boolean;
  message: string;
  data?: T;
};
