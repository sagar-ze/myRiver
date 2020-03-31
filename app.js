
const express = require('express');
require('express-async-errors');
const app = express();

require('./startup/db')()
require('./startup/routes')(app)

module.exports = app;
