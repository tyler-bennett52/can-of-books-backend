'use strict';

const mongoose = require('mongoose');
const Book = require('./models/books')

require('dotenv').config();
mongoose.connect(process.env.MONGODB);

async function seed() {

  await Book.create({
    title: 'Fellowship of the Ring',
    description: 'A book about men who love jewelry',
    status: 'Read'
  });
  await Book.create({
    title: 'The Two Towers',
    description: 'A book about old men getting mad at each other',
    status: 'Read'
  });
  await Book.create({
    title: 'Return of the King',
    description: 'A book about a wizard staging a coup d\'etat in Gondor',
    status: 'Read'
  });
  mongoose.disconnect();
}

seed();
