
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const morgan = require('morgan');

const viewBooks = require('./view-books');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/books', viewBooks);
// app.use('/characters', rteCharacters);

// ===========================================================
// ROLL MY OWN 404
// ===========================================================
app.use((req, res, next) => {
  console.log("=========== PAGE NOT FOUND ==========");
  res.status(404).json({ message: "Page not found" });
  next();
});

// ===========================================================
// ROLL MY OWN 500
// ===========================================================
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.log("=========== APP ERROR ==========");
  console.log(err);
  console.log("^^^^^^^^^^^ APP ERROR ^^^^^^^^^");
  res.status(status).json({ error: err });
  next();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Bookstore API listening on port ${port}!`);
  });
}

module.exports = app;
