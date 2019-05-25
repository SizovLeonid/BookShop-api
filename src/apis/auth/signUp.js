const router = require('express').Router();
const swagger = require('swagger-spec-express');
const sql = require('mssql');
const uniqid = require('uniqid');

swagger.swaggerise(router);

router.post('/sign-up', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body;

  const sid = uniqid();

  const newUserQuery = `
    INSERT INTO [dbo].[Users]
          ([firstName]
          ,[lastName]
          ,[email]
          ,[password])
    VALUES
          (${firstName}
          ,${lastName}
          ,${email}
          ,${password})
  `;

  const sessionQuery = `
    INSERT INTO [dbo].[Session]
          ([sid]
          ,[email])
    VALUES
          (${sid}
          ,${email})
  `;

  await new sql.Request().query(newUserQuery);
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
