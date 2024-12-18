// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

const Jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '1w';

const validateRefreshToken = function (refreshToken) {
  return new Promise(function (resolve, reject) {
    Jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          resolve(null);
        }
        else {
          resolve(decoded);
        }
      }
    );
  });
}

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.post('/auth/logout', async function (req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (refreshToken) {
        const refreshTokenPayload = await validateRefreshToken(refreshToken);
        if (refreshTokenPayload) {
          await knex('sessions')
            .where('code', '=', refreshTokenPayload.sessionCode)
            .whereNull('end_datetime')
            .update({
              end_datetime: new Date()
            });
        }
      }
      res.send(null);
    }
    catch (err) {
      res
        .status(500)
        .send({
          code: 500,
          message: 'Internal Server Error',
          description: 'Something went wrong',
          translationKey: 'somethingWentWrong'
        });
      console.error(err);
    }
  });
}