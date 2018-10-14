const express = require('express');
const router = express.Router();
const model = require('./model.js');
const chkBodyParams = require('./params').chkBodyParams;

/* **************************************************
*  POST /books
*  Add a new book
*  @body title
*  @body desc
*  @return the new book record with id or forwards w/ next(Error)
http POST localhost:3000/books title='Bible' desc='The only book you need!'
***************************************************** */
router.post('', (req, res, next) => {
  const oParams = {
    title: 'string',
    desc: 'string',
  };
  if (!chkBodyParams(oParams, req, res, next))
    return;

  model.createBook(req.body.title, req.body.desc)
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
*    Note: authors must be updated individually through \books\:id\authors api
*  @body title
*  @body borrowed
*  @body desc
*  Return, the updated book record
http PUT localhost:3000/books/123... title='new title' borrowed=true desc='new desc'
***************************************************** */
router.put('/:id', (req, res, next) => {
  const oParams = {
    title: 'string',
    borrowed: 'bool',
    desc: 'string',
  };
  if (!chkBodyParams(oParams, req, res, next))
    return;

  const oBook = {
    id: req.params.id,
    title: req.body.title,
    borrowed: req.body.borrowed,
    desc: req.body.desc,

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

module.exports = router;
