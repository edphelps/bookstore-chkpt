const uuidv4 = require('uuid/v4');
const fs = require('fs');
const { promisify } = require('util');

const DB_FILE_NAME = './books.json';

// Caller must implement .catch()
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

// caller must implement catch
function bookInsert(sTitle, sDesc) {
  return loadDb()
    .then((aBooks) => {
      console.log(typeof aBooks);
      if (aBooks.find(oBook => oBook.title.toLowerCase() === sTitle.toLowerCase())) {
        console.log("** book exists");
        throw new Error("BOOK EXISTS");
      }
      const oNewBook = {};
      oNewBook.id = uuidv4();
      oNewBook.title = sTitle;
      oNewBook.borrowed = false;
      oNewBook.desc = sDesc;
      oNewBook.authors = [];
      aBooks.push(oNewBook);
      return oNewBook;
    })
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
