import {HttpStatusCodes} from '../constants';

export type ResponseType<T> = {
  status: HttpStatusCodes;
  success: boolean;
  message: string;
  data?: T;
};
