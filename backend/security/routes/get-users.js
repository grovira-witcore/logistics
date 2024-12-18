// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.get('/auth/users', async function (req, res) {
    try {
      if (req.role !== 'administrator') {
        res
          .status(403)
          .send({
            code: 403,
            message: 'Forbidden',
            description: 'Access denied',
            translationKey: 'accessDenied'
          });
        return;
      }
      const selectFields = [
        'user_id as userId',
        'username as username',
        'first_name as firstName',
        'last_name as lastName',
        'email as email',
        'avatar as avatar',
        'role as role'
      ];
      if (securityOptions.enableByUserPassword) {
        selectFields.push('must_change_password as mustChangePassword');
      }
      if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
        selectFields.push('provider_name as providerName');
      }
      selectFields.push('blocked as blocked');
      let knexQuery = knex
        .select(...selectFields)
        .from('users');
      if (req.query['username'] !== null && req.query['username'] !== undefined) {
        knexQuery = knexQuery.whereLike(knex.raw('LOWER(username)'), req.query['username'].toLowerCase());
      }
      knexQuery = knexQuery.orderBy([
        { column: 'first_name', order: 'asc' },
        { column: 'last_name', order: 'asc' },
      ]);
      if (req.query['offset']) {
        knexQuery = knexQuery.offset(parseInt(req.query['offset']));
      }
      if (req.query['limit']) {
        knexQuery = knexQuery.limit(parseInt(req.query['limit']));
      }
      const users = await knexQuery;
      res.send(users);
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
