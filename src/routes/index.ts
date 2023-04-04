import { Express } from 'express';
import authRoute from './auth.route';
import categoryRoute from './category.route';

const route = (app: Express) => {
  app.use('/auth', authRoute);
  app.use('/category', categoryRoute);
};

export default route;
