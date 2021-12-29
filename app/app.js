const express = require('express');
const { errors } = require('celebrate');
require('dotenv').config();
require('../trigger');

const app = express();

const port = '3333'

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const defaultRoute = require('../routes/defaultRoute');

app.use('/',defaultRoute);

app.use(errors());

app.listen(port);

console.log("Api rodando em http://localhost:" + port)