const router = require('express').Router();

router.use(require('./signIn'));
router.use(require('./signUp'));

module.exports = router;
