const uuidv4 = require('uuid/v4');
const fs = require('fs');
const { promisify } = require('util');

const DB_FILE_NAME = './books.json';

/* **************************************************
*  loadDb()
*  Load database
*  @return Promise: [ {book}, ... ]
*  .catch(error) -- file not found or can't be read
***************************************************** */
function loadDb() {
  return promisify(fs.readFile)(DB_FILE_NAME, 'utf8')
    .then(buffer => JSON.parse(buffer));
}

/* **************************************************
*  saveDb()
*  Save database
*  @return Promise: [ {book}, ... ]
*  .catch(error) file not found or can't be read
***************************************************** */
function saveDb(aBooks) {
  return promisify(fs.writeFile)(DB_FILE_NAME, JSON.stringify(aBooks, null, 2), 'utf8');
}

/* **************************************************
*  bookCreate()
*  @param sTitle, new book title
*  @param sDesc, new book desc
*  @return Promise: oNewBook, book that was added including its assigned id
*  .catch(error) from loadDb() or
*                Error("book already exists")
***************************************************** */
function bookCreate(sTitle, sDesc) {
  let aBooks = [];
  let oNewBook = {};
  return loadDb()
    .then((_aBooks) => {
      aBooks = _aBooks;
      if (aBooks.find(oBook => oBook.title.toLowerCase() === sTitle.toLowerCase())) {
        console.log("internal error: book exists");
        throw new Error("book already exists");
      }
      oNewBook = {};
      oNewBook.id = uuidv4();
      oNewBook.title = sTitle;
      oNewBook.borrowed = false;
      oNewBook.desc = sDesc;
      oNewBook.authors = [];
      aBooks.push(oNewBook);
    })
    .then(() => saveDb(aBooks))
    .then(() => oNewBook);
}

/* **************************************************
*  bookRead()
*  @param sId, book id
*  @param sDesc new book desc
*  @return oNewBook, book that was added with uuid
*  .catch(error) from loadDb() or
*                Error("book already exists")
***************************************************** */
function bookCreate(sId) {
  let aBooks = [];
  let oNewBook = {};
  return loadDb()
    .then((_aBooks) => {
      aBooks = _aBooks;
      if (aBooks.find(oBook => oBook.title.toLowerCase() === sTitle.toLowerCase())) {
        console.log("internal error: book exists");
        throw new Error("book already exists");
      }
      oNewBook = {};
      oNewBook.id = uuidv4();
      oNewBook.title = sTitle;
      oNewBook.borrowed = false;
      oNewBook.desc = sDesc;
      oNewBook.authors = [];
      aBooks.push(oNewBook);
    })
    .then(() => saveDb(aBooks))
    .then(() => oNewBook);
}



bookCreate('Bible', 'The definitive guide to life.')
  .then((oBook) => {
    console.log("added book: ", oBook);
  })
  .then(() => bookCreate('Bible', 'The definitive guide to life.'))
  .then((oBook) => {
    console.log("added another book: ", oBook);
  })
  .catch((error) => {
    console.log("catch(): failed to insert book: ", error);
  });

// loadDb()
//   .then((aBooks) => {
//     saveDb(aBooks);
//   })
