import { Express } from 'express';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import productRoute from './product.route';
import cartRoute from './cart.route';
import addressRoute from './address.route';
import userRoute from './user.route';

const route = (app: Express) => {
  app.use('/auth', authRoute);
  app.use('/category', categoryRoute);
  app.use('/product', productRoute);
  app.use('/cart', cartRoute);
  app.use('/address', addressRoute);
  app.use('/user', userRoute);
};

export default route;
