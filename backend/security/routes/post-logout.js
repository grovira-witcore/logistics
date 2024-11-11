const getAccessToken = function (headers) {
  if (headers && headers.authorization) {
    const authParts = headers.authorization.split(' ');
    if (authParts.length === 2) {
      return authParts[1];
    }
  }
  return null;
}

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.post('/auth/logout', async function (req, res) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        const accessToken = getAccessToken(req.headers);
        await knex('sessions')
          .where('access_token', '=', accessToken)
          .delete();
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