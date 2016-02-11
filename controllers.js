angular
  .module('bookApp')
  .controller('BooksController', BooksController);

function BooksController (Book) {
  this.book = Book.get({ id: 1 }, function(data) {
      console.log(data);
    }); // get() returns a single book  

  this.newBook = {};
  this.books = Book.query(); // returns all the books
  this.createBook = createBook;
  this.updateBook = updateBook;
  this.deleteBook = deleteBook;

  function updateBook(book) {
    Book.update({id: book._id}, book);
    book.displayEditForm = false;
  };

  function createBook(){
    Book.save(this.newBook);
    this.newBook = {}; // clear new book object
    this.books.push(this.newBook_with_id);
  };

  function deleteBook(book) {
    Book.remove({id:book._id});
    var bookIndex = this.books.indexOf(book);
    this.books.splice(bookIndex, 1);
  };

  console.log("Controller loaded.");
};
