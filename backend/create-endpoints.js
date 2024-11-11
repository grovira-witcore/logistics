const Fs = require('fs');
const Express = require('express');
const Security = require('./security/security.js');

module.exports = async function (knex, express, roles) {
  const apiRouter = Express.Router();
  apiRouter.use(Express.json());
  await Security.initRoutes(knex, apiRouter, roles);
  const filesNames = await Fs.promises.readdir('./routes');
  filesNames.forEach(fileName => {
    require('./routes/' + fileName)(knex, apiRouter);
  });
  express.use(apiRouter);
}
