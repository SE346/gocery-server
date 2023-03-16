import authRoute from './auth.route';

const route = (app: any) => {
  app.use('/auth', authRoute);
};

export default route;
