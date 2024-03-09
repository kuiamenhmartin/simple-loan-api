import express, {NextFunction, Request, Response} from 'express';
import {HttpLogsService} from '../../../services';
import {Server} from 'http';
import supertest from 'supertest';
import {HttpStatusCodes} from '../../../constants';
import {TestConfig} from '../../fixtures/config.fixtures';

describe('Http-Logs Service (unit)', () => {
  const app = express();
  let server: Server;
  let port = TestConfig.PORT;

  before(async () => {
    app.get('/test', [
      HttpLogsService.log,
      (req: Request, res: Response) => {
        res.send('success');
      },
    ]);

    app.get('/error', [
      HttpLogsService.log,
      () => {
        throw new Error('error');
      },
    ]);

    app.get('/unauthorized', [
      HttpLogsService.log,
      (req: Request, res: Response) => {
        res.status(HttpStatusCodes.UNAUTHORIZED);
        res.send('unauthorized');
      },
    ]);

    app.get('/write', [
      (req: Request, res: Response, next: NextFunction) => {
        req.headers['x-forwarded-for'] = '127.0.0.2';
        next();
      },
      HttpLogsService.log,
      (req: Request, res: Response) => {
        res.status(HttpStatusCodes.OK);
        res.write('message');
        res.end();
      },
    ]);
    server = app.listen(port++);
  });

  it('should log an http request', async () => {
    await supertest(app).get('/test').expect(HttpStatusCodes.OK);
  });

  it('should log an http error', async () => {
    await supertest(app)
      .get('/error')
      .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should log an http unauthorized', async () => {
    await supertest(app)
      .get('/unauthorized')
      .expect(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should use res.write from http-log', async () => {
    await supertest(app).get('/write').expect(HttpStatusCodes.OK);
  });

  after(async () => {
    server.close();
  });
});
