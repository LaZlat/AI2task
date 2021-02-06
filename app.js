const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();

app.use(cors())
app.use(bodyParser.json());

const mainRoutes = require('./routes/main');
const findRoutes = require('./routes/find');


app.use('/', mainRoutes);
app.use('/find', findRoutes);

module.exports = app