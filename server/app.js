var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Krävs för kommunikation med React [cite: 63]
const cors = require('cors'); // Överst vid imports
const app = express();

// Importera rutter enligt arkitekturdiagrammet på sida 6 [cite: 98]
var productRoutes = require('./routes/productRoutes');
// var userRoutes = require('./routes/userRoutes'); // Aktivera när du skapat filen 
var userRoutes = require('./routes/userRoutes');
var cartRoutes = require('./routes/cartRoutes');


// Middleware
app.use(cors()); // Tillåter anrop från din frontend [cite: 63]
app.use(logger('dev'));
app.use(express.json()); // Krävs för att ta emot JSON i POST/PUT [cite: 91]
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API-rutter enligt specifikation på sida 8 [cite: 198]
app.use('/api/products', productRoutes); // Hanterar CRUD för produkter [cite: 200]
// app.use('/api/users', userRoutes); // Hanterar användare och varukorg [cite: 202, 204]
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
// Enkel felhantering (bra för UX enligt sida 10) [cite: 270]
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Något gick fel i servern!' });
});

module.exports = app;

