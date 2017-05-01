import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as express from 'express';
import * as cors from 'cors';
import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import './controllers/PlaceController';

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
      `${__dirname}/entity/*.js`
    ],
    autoSchemaSync: true,
}).then(async () => {
  const app = express();

  app.use(express.static('public'));
  app.use(cors({ origin: '*' }));
  useExpressServer(app);

  app.listen(4000, () => console.log('server is now listening on port 4000'));
}).catch(error => console.log(error));
