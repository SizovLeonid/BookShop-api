const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/books', require('./books'));

module.exports = router;
