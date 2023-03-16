import express, { Express, Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import route from './routes';
import cookieParser from 'cookie-parser';
import { sequelize } from './config/sequelize';

const app: Express = express();

// Apply middleware
app.use(express.json()); // req.body
app.use(cookieParser()); // Allow server read cookie
app.use(express.urlencoded({ extended: true }));

// Connect database
sequelize
  .sync()
  .then((data) => console.log('All table async successfully'))
  .catch((err) => console.log('All table async failed: ', err));

route(app);

// Handle error
app.use((req, res, next: NextFunction) => {
  next(createError.NotFound('This route does not exist.'));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});

// Kiểm tra biến môi trường có PORT chạy server không? Nếu không lấy PORT 5000
const PORT = process.env.PORT || 5000;

// Server chạy với PORT được gán bên trên
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
