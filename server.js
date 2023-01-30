'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Book = require('./models/books');
const verifyUser = require('./auth');


app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {

  response.send('Welcome to my home');

});

app.use(verifyUser);

app.get('/books', async (request, response) => {
  try {
    let booksFromDb = await Book.find({ email: request.user.email });
    response.status(200).send(booksFromDb);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

app.post('/books', postBook);

async function postBook(request, response, next) {
  try {
    let createdBook = await Book.create({...request.body, email: request.user.email});
    response.status(201).send(createdBook);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

app.delete('/books/:bookID', deleteBook);

async function deleteBook(request, response, next) {
  try {
    let id = request.params.bookID;
    await Book.findByIdAndDelete(id);
    response.status(200).send('Book Deleted');
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

app.put('/books/:bookId', updateBook);

async function updateBook(request, response, next) {
  try {
    let bookId = request.params.bookId;
    let data = request.body;
    const updatedBook = await Book.findByIdAndUpdate(bookId, {...data, email: request.user.email}, { new: true, overwrite: true });
    console.log(data);
    response.status(200).send(updatedBook)
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Sorry that page doesn\'t exist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
