import { Express } from 'express';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import productRoute from './product.route';
import commentRoute from './comment.route';
import cartRoute from './cart.route';
import addressRoute from './address.route';
import userRoute from './user.route';
import orderRoute from './order.route';
import couponRoute from './coupon.route';
import statisticRoute from './statistic.route';
import apiDocsRoute from './api-docs.route';

const route = (app: Express) => {
  app.use('/api-docs', apiDocsRoute);
  app.use('/auth', authRoute);
  app.use('/category', categoryRoute);
  app.use('/product', productRoute);
  app.use('/comment', commentRoute);
  app.use('/cart', cartRoute);
  app.use('/address', addressRoute);
  app.use('/user', userRoute);
  app.use('/order', orderRoute);
  app.use('/coupon', couponRoute);
  app.use('/statistic', statisticRoute);
};

export default route;
