const express = require('express');
const router = express.Router();
const model = require('./model.js');


// /* **************************************************
// *  formatError()
// *  @param Error, actual Error object
// *  @return, string with the stack string split from message.
// *           Or entire stack string if ' at ' not found.
// ***************************************************** */
// function formatError(error) {
//   const i = error.stack.search(' at ');
//   if (i === -1)
//     return error.stack;
//   const stack = error.stack.slice(i + 4);
//   return `${error.message} [${stack}]`
// }
//
// /* **************************************************
// *  restructureError()
// *  @param Error -- actual Error object
// *  Returns object { message: 'xxxx', stack: 'xxx' }
// ***************************************************** */
// function restructureError(error) {
//   const i = error.stack.search(' at ');
//   if (i === -1)
//     return { message: error.message, stack: 'undetermines' };
//   return { error: { message: error.message, stack: error.stack.slice(i + 4) } };
// }

/* **************************************************
*  POST /books
*  @body title
*  @body desc
*  Add a new book or error
http POST localhost:3000/books title='Bible' desc='The only book you need!'
***************************************************** */
router.post('', (req, res, next) => {
  const { title, desc } = req.body;
  if (!title || !desc) {
    res.status(400).json({ error: { message: 'must pass title and desc' } });
    return;
  }

  model.createBook(title, desc)
    .then((newBook) => {
      res.status(201).json(newBook);
    })
    .catch((error) => {
      error.status = 400;
      next(error);
    });
});

/* **************************************************
*  GET /books
*  Return array of all books
http GET localhost:3000/books
***************************************************** */
router.get('', (req, res, next) => {
  model.readBook()
    .then((aBooks) => {
      res.status(200).json(aBooks);
    })
    .catch((error) => {
      error.status = 400;
      next(error);
    });
});

/* **************************************************
*  GET /books/:id
*  Return the book
http GET localhost:3000/books/91eabf57-f817-42ca-914b-5517120acde6
***************************************************** */
router.get('/:id', (req, res, next) => {
  model.readBook(req.params.id)
    .then((oBook) => {
      res.status(200).json(oBook);
    })
    .catch((error) => {
      error.status = 404;
      next(error);
    });
});

/* **************************************************
*  PUT /books/:id
*  Update the book
*  @body title
*  @body borrowed
*  @body desc
*  Return, the updated book record
http PUT localhost:3000/books/123... title='new title' borrowed=true desc='new desc'
***************************************************** */
router.put('/:id', (req, res, next) => {
  const { title, borrowed, desc } = req.body;
  if (!title || !desc || typeof borrowed === 'undefined') {
    res.status(400).json({ error: { message: 'must pass title, borrowed, and desc' } });
    return;
  }
  const oBook = {
    id: req.params.id,
    title,
    borrowed,
    desc,
    // authors must be updated individually through \books\:id\authors api
  };
  model.updateBook(oBook)
    .then((updatedBook) => {
      res.status(201).json(updatedBook);
    })
    .catch((error) => {
      error.status = 400;
      next(error);
    });
});

/* **************************************************
*  DELETE /books/:id
*  Delete the book
*  Return, the deleted record
http DELETE localhost:3000/books/63551063-2f9c-48a4-9eda-5fa44ea8d1bf
***************************************************** */
router.delete('/:id', (req, res, next) => {
  model.deleteBook(req.params.id)
    .then((oBook) => {
      res.status(200).json(oBook);
    })
    .catch((error) => {
      error.status = 404;
      next(error);
    });
});

// ===========================================================
// GET /series/:id/characters
// Get all characters for a series
// ===========================================================
router.get('/:id/characters', (req, res, next) => {
  console.log("~~ GET /series/:id/characters");

  // find the series
  const series = db.series.find(testSeries => testSeries.id === req.params.id);
  if (!series) {
    res.status(404).json({ error: { message: 'unk series' } });
    return;
  }

  // return array of characters in the series
  res.json(db.characters.filter(character => character.series_id === series.id));
});

module.exports = router;
