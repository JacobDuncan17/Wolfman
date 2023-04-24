const router = require('express').Router();
const { MXPortForwardingRulesController } = require('meraki');
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => res.send('This is a the wrong route'));

module.exports = router;