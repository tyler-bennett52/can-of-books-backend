'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Book = require('./models/books');


app.use(cors());
mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {

  response.send('Welcome to my home');

});

app.get('/books', async (request, response) => {
  try {
    let booksFromDb = await Book.find();
    response.status(200).send(booksFromDb);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

app.get('*', (request, response) => {
  response.status(404).send('Sorry that page doesn\'t exist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
