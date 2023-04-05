import { Express } from 'express';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import productRoute from './product.route';
import cartRoute from './cart.route';

const route = (app: Express) => {
  app.use('/auth', authRoute);
  app.use('/category', categoryRoute);
  app.use('/product', productRoute);
  app.use('/cart', cartRoute);
};

export default route;
