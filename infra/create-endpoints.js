const Path = require('path');
const Fs = require('fs');
const Express = require('express');
const Security = require('./security/security.js');

module.exports = async function (knex, express, roles) {
  express.use(Express.static(Path.join(__dirname, 'public')));
  const apiRouter = Express.Router();
  apiRouter.use(Express.json());
  await Security.init(knex, apiRouter, roles);
  const filesNames = await Fs.promises.readdir('./routes');
  filesNames.forEach(fileName => {
    require('./routes/' + fileName)(knex, apiRouter);
  });
  express.use('/api', apiRouter);
  express.get('/*', (req, res) => {
    res.sendFile(Path.join(__dirname, 'public', 'index.html'));
  });
}
