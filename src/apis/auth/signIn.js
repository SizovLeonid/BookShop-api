const router = require('express').Router();
const swagger = require('swagger-spec-express');
const sql = require('mssql');

swagger.swaggerise(router);

router.post('/sign-in', async (req, res) => {
  let foundUser;
  const request = new sql.Request();
  const users = await request.query('SELECT * FROM Users');

  for(let i = 0; i < users.length; i++) {
    const user = users[i];
    if(user.email === req.body.email && user.password === req.body.password) {
      foundUser = user.email;
      break;
    }
  }

  if(foundUser !== undefined) {
    req.session.email = foundUser;
    res.send('true');
  }

}).describe({
  responses: {
    200: {
      description: 'Returns JWT token'
    }
  },
});

module.exports = router;
