const router = require('express').Router();
const swagger = require('swagger-spec-express');
const sql = require('mssql');
const uniqid = require('uniqid');

swagger.swaggerise(router);

router.post('/sign-in', async (req, res) => {
  const {
    email,
    password
  } = req.body;

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

  const sid = uniqid();

  const searchQuery = `
    SELECT *
    FROM Users
    WHERE email = ${email} password = ${password}
  `;

  const sessionQuery = `
    INSERT INTO [dbo].[Session]
          ([sid]
          ,[email])
    VALUES
          (${sid}
          ,${email})
  `;

  const user = await new sql.Request().query(searchQuery);

  if (!user) {  // TODO validation if not found
    res.status(401).send();
  }

  await new sql.Request().query(sessionQuery);

  res.cookie('sid', sid, { httpOnly: false });
  res.status(204).send();
}).describe({
  responses: {
    200: {
      description: 'Returns JWT token'
    }
  },
});

module.exports = router;
