const sql = require('mssql');
const router = require('express').Router();
const swagger = require('swagger-spec-express');

swagger.swaggerise(router);

router.get('/get-books', async (req, res) => {
  try {
    const books = new sql.Request();
    const response = await books.query('SELECT * FROM Book ');


    res.status(200).json(response.recordset);
  } catch(e) {
    res.status(500).json();
  }
}).describe({
  responses: {
    200: {
      description: 'Returns JWT token'
    }
  },
});

router.get('/get-interesting', async (req, res) => {
  try {
    const interesting = new sql.Request();
    const response = await interesting.query('SELECT * FROM Book WHERE interesting = \'yes\'');


    res.status(200).json(response.recordset);
  } catch(e) {
    res.status(500).json();
  }
}).describe({
  responses: {
    200: {
      description: 'Returns JWT token'
    }
  },
});


module.exports = router;
