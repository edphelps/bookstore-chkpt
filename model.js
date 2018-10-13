const uuidv4 = require('uuid/v4');
const fs = require('fs');
const { promisify } = require('util');

const DB_FILE_NAME = './books.json';

// loadDb()
// Load the database
// @return -- [ {book}, ... ]
// .catch(error) -- file not found or can't be read
function loadDb() {
  return promisify(fs.readFile)(DB_FILE_NAME, 'utf8')
    .then(buffer => JSON.parse(buffer));
}

// loadDb()
//   .then((arr) => {
//     console.log(typeof arr);
//     console.log(arr instanceof Array);
//     console.log("arr: ", arr);
//   })
//   .catch((error) => {
//     console.log("XXXX error: ", error);
//   });

// bookInsert()
// @param sTitle -- new book title
// @param sDesc -- new book desc
// @return oNewBook -- new book that was added
// .catch(error) -- from loadDb() or
//                  Error("book already exists")
function bookInsert(sTitle, sDesc) {
  return loadDb()
    .then((aBooks) => {
      console.log(typeof aBooks);
      if (aBooks.find(oBook => oBook.title.toLowerCase() === sTitle.toLowerCase())) {
        console.log("** book exists");
        throw new Error("book already exists");
      }
      const oNewBook = {};
      oNewBook.id = uuidv4();
      oNewBook.title = sTitle;
      oNewBook.borrowed = false;
      oNewBook.desc = sDesc;
      oNewBook.authors = [];
      aBooks.push(oNewBook);
      return oNewBook;
    });
}

bookInsert('Bible', 'The definitive guide to life.')
  .then((oBook) => {
    console.log("added book: ", oBook);
  })
  .catch((error) => {
    console.log("XXX failed to insert book: ", error);
  });

bookInsert('Bible', 'The definitive guide to life.')
  .then((oBook) => {
    console.log("added book: ", oBook);
  })
  .catch((error) => {
    console.log("XXX failed to insert book: ", error);
  });
