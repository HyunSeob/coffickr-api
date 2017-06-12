import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as express from 'express';
import * as cors from 'cors';
import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as env from './env';
import './controllers/PlaceController';
import './controllers/PlaceEnvironmentController';
import './controllers/UserController';
import './controllers/AuthController';
import { Place } from './entity/Place';
import { User } from './entity/User';
import { PlaceEnvironment } from './entity/PlaceEnvironment';
import { PlaceEvaluation } from './entity/PlaceEvaluation';
import { PlaceComment } from './entity/PlaceComment';

const JWT_SECRET = 'cx@H6[_>Q4os$/)xBAXw?Ecc';

createConnection({
    driver: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'coffickr',
        password: 'coffickr',
        database: 'coffickr'
    },
    entities: [
      Place,
      User,
      PlaceEnvironment,
      PlaceEvaluation,
      PlaceComment
    ],
    autoSchemaSync: true,
}).then(async () => {
  const app = express();

  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors({ origin: env.origin }));
  app.set('jwt-secret', JWT_SECRET);

  useExpressServer(app);

  app.listen(4000, () => console.log('server is now listening on port 4000'));
}).catch(error => console.log(error));
