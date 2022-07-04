const viewRoutes = require('./viewRoutes.js');
const tourRoutes = require('./tourRoutes.js');
const userRoutes = require('./userRoutes.js');
const meRoutes = require('./meRoutes.js');
const authController = require('../app/controllers/authController.js');

function route(app) {
  //NOTE: authorization protect
  app.use(authController.protect);

  //TODO: views page home
  app.use('/', viewRoutes);
  app.use('/tour', tourRoutes);
  app.use('/users', userRoutes);
  app.use('/me', meRoutes);

  //TODO: error 404
  app.all('*', (req, res, next) => {
    res.render('notFound');
  });
}

module.exports = route;
