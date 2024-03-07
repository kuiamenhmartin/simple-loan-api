import express, {NextFunction, Request, Response} from 'express';
import {json, urlencoded} from 'body-parser';
import {HttpErrors} from './utils';
import {HttpLogsService} from './services';
import { loanRouter } from './routes';
import { Config } from './config';

const app = express();
const config = new Config();

app.use(json());
app.use(urlencoded({extended: true}));
app.set('trust proxy', true);
app.disable('x-powered-by');
app.use(HttpLogsService.log);

// public routes
app.use(loanRouter);

// default 404 response
app.all('*', async (req: Request, _res: Response, next: NextFunction) => {
  next(HttpErrors.NotFound(`Cannot ${req.method.toUpperCase()} ${req.path}`));
});

// throws any error passed to next(err)
app.use(HttpErrors.Throw);

// run application
app.listen(config.port);

export default app;

