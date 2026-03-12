
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;

/**
 * var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Krav för att frontenden ska kunna prata med backenden

// Importera rutter
var productRoutes = require('./routes/productRoutes');

var app = express();

app.use(cors()); // Tillåt anrop från din React-app
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Koppla rutter - detta skapar URL:en http://localhost:5000/api/products
app.use('/api/products', productRoutes);

module.exports = app;
 */
