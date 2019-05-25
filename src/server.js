const api = require('./apis');
const cookieParser = require('cookie-parser');
const express = require('express');
const sql = require('mssql');
const swagger = require('swagger-spec-express');
const swaggerUi = require('swagger-ui-express');
const { authMiddleware } = require('./helpers');

const connectToDatabase = async () => {
  const config = {
    user: 'sa',
    password: '123456789q',
    server: 'localhost',
    database: 'BookShop'
  };

  try {
    await sql.connect(config);
  } catch(e) {
    throw Error('Can not connect to database');
  }
};


(async () => {
  const app = express();
  const router = express.Router();

  const port = process.env.PORT || 9090;

  await connectToDatabase();

  swagger.initialise(app, {
    title: 'BookShop API',
    version: '1.0.0',
    produces: ['application/json']
  });

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, authentication');
    next();
  });

  app.use(cookieParser());
  app.use(authMiddleware);

  app.use('/api', api);

  swagger.compile();

  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(swagger.json()));

  app.use(router);

  app.listen(port, () => {
    console.log(`Server is listening on port${port}`);
  });
})();





