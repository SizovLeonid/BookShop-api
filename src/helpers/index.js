const sql = require('mssql');

exports.authMiddleware = async (req, res, next) => {
  if (req.cookies.sid) {
    const email = await new sql.Request().query(`SELECT email FROM Session WHERE sid = ${req.cookies.sid}`);
    req.email = email;
    next();
  } else {
    next();
  }
};
