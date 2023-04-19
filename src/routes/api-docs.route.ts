import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend for gocery',
      description: 'A collection APIs for gocery',
      version: '1.0.0',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'tuannt02',
        url: 'https://www.facebook.com/tuannt02/',
        email: 'tuannt150102@gmail.com',
      },
    },
  },
  apis: [path.join(__dirname, '..', 'docs', '*', '*.ts')],
};

const spec = swaggerJSDoc(options);

const router: Router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));

export default router;
