import { Express } from 'express';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import productRoute from './product.route';

const route = (app: Express) => {
  app.use('/auth', authRoute);
  app.use('/category', categoryRoute);
  app.use('/product', productRoute);
};

export default route;
