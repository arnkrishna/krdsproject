const router = require('express').Router();
const bookModel = require('../model/book_model');

router.get('/books', async function (req, res) {
   const bookList = await bookModel.find();
   console.log(bookList);
   res.send(bookList);
});

//  using GET method for get book data using book id
//  localhost:5000/books/12390

router.get('/books/:id', async function (req, res) {
    const { id } = req.params;
    const book = await bookModel.findOne({isbn : id});
    if(!book) return res.send("Book Not Found");
    res.send(book);
});

// Store Book Data in DB using POST method
// localhost:5000/books

router.post('/books', async function (req, res) {
    const title= req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const bookExist = await bookModel.findOne({isbn : isbn});
  
    if (bookExist) return res.send('Book already exist');

    var data = await bookModel.create({title,isbn,author});
    data.save();

    res.send("Book Uploaded");
});

//  update book data using book id ing PUT method
//  localhost:5000/books/12390

router.put('/books/:id', async function (req, res) {
    const { id } = req.params;
    const {
        title,
        authors,
    } = req.body;

    const bookExist = await bookModel.findOne({isbn : id});
    if (!bookExist) return res.send('Book Do Not exist');


    const updateField = (val, prev) => !val ? prev : val;

    const updatedBook = {
        ...bookExist ,
        title: updateField(title, bookExist.title),
        authors: updateField(authors, bookExist.authors),
        
    };

    await bookModel.updateOne({isbn: id},{$set :{title : updatedBook.title, author: updatedBook.authors}})
    
    res.status(200).send("Book Updated");
});

// using DELETE method for delete book data using book id
// localhost:5000/books/12390
router.delete('/books/:id', async function (req, res) {
    const { id } = req.params;

    const bookExist = await bookModel.findOne({isbn : id});
    if (!bookExist) return res.send('Book Do Not exist');

   await bookModel.deleteOne({ isbn: id }).then(function(){
        console.log("Data deleted"); // Success
        res.send("Book Record Deleted Successfully")
    }).catch(function(error){
        console.log(error); // Failure
    });
});

// Adding into Fav's

router.post('/books/fav', async function (req, res) {
    const title= req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;
    const bookExist = await bookModel.findOne({isbn : isbn});
  
    if (bookExist) return res.send('Book already exist');

    var data = await bookModel.create({title,isbn,author});
    data.save();

    res.send("Book Uploaded");
});

router.get('/books/fav', async function (req, res) {
    const bookList = await bookModel.find();
    console.log(bookList);
    res.send(bookList);
 });
module.exports = router;