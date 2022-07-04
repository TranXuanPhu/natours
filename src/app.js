const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

//NOTE: import file
const route = require('./routes/index.js');
const middleware = require('./app/middlewares/middleware.js');

const app = express();

//NOTE:  Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//NOTE: setting static file
app.use(express.static(path.join(__dirname, 'public')));

//NOTE: use middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//NOTE: custom middleware
app.use(middleware.setLocal);

//NOTE: setting handlebars
app.engine(
  '.hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: require('./helpers/handlebars.js'),
  })
);
app.set('view engine', '.hbs');
app.set('views', 'src/resources/views');
//NOTE: routes
route(app);

module.exports = app;
