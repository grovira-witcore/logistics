const Path = require('path');
const Fs = require('fs');
const Express = require('express');
const Security = require('./security/security.js');

module.exports = async function (knex, express, roles) {
  express.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';");
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.removeHeader('X-Powered-By');
    next();
  });
  express.use(Express.static(Path.join(__dirname, 'public')));
  const apiRouter = Express.Router();
  apiRouter.use(Express.json());
  await Security.initRoutes(knex, apiRouter, roles);
  const filesNames = await Fs.promises.readdir('./routes');
  filesNames.forEach(fileName => {
    require('./routes/' + fileName)(knex, apiRouter);
  });
  express.use('/api', apiRouter);
  express.get('/latest/*', (req, res) => {
    res.status(404).send('Not Found');
  });
  express.get('/*', (req, res) => {
    res.sendFile(Path.join(__dirname, 'public', 'index.html'));
  });
}
