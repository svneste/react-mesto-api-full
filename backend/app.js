const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const cors = require('./middlewares/cors');
const routerNotFound = require('./middlewares/error-not-found');
const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');

const {
  validationCreateUser,
  validationLoginUser,
} = require('./middlewares/validations');

const app = express();
app.use(bodyParser.json());

app.use(cors);

app.use(requestLogger);

app.post('/signin', validationLoginUser, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', routerNotFound);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
}).then(() => console.log('yes'))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
});
