# <img src="https://cloud.githubusercontent.com/assets/7833470/10899314/63829980-8188-11e5-8cdd-4ded5bcb6e36.png" height="60"> Angular Book App

<img src="https://media.giphy.com/media/oFPiPgqwof4Pe/giphy.gif" width=400>

| **Learning Objectives** |
| :---- |
| Identify the benefits of using $resource over $http |
| Establish a connection with an external RESTful API |
| Create an index view for CRUDing book resources|

Built on the top of the `$http` service, Angular’s `$resource` is a service that lets you interact with RESTful backends easily. `$resource` is very similar to models in Rails. In this tutorial, we're going to make use of a book API that can be found here: `https://super-crud.herokuapp.com/books`.

Your goal is to allow a user to CRUD books!

## Installation
1. Clone this repo and run `bower install`
1. The `$resource` service doesn’t come bundled with the main Angular script. Run `bower install --save angular-resource`.
1. Add a link to the angular-resource module in your `index.html` (BELOW angular.js!):
```html
<script src="bower_components/angular-resource/angular-resource.min.js"></script>
```
1. Now you need to load the `$resource` module into your application.
```js
angular.module('app', [..., 'ngResource']);
```
1. In the application directory run a local server:
``` bash
budo
#or
python -m SimpleHTTPServer 8000
# or
ruby -rwebrick -e 'WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => Dir.pwd).start'
```

## Interacting with the API
1. To use `$resource` inside your controller/service you need to declare a dependency on `$resource`. The next step is calling the `$resource()` function with your REST endpoint, as shown in the following example. This function call returns a `$resource` class representation which can be used to interact with the REST backend.

1. Take a look at `services.js` which uses `$resource` (ngResource) to create a Book service:

`services.js`

  ```js
  angular.module('bookApp').service('Book', function($resource) {
    return $resource('https://super-crud.herokuapp.com/books/:id');
  });
  ```

The result of this function call is a resource class object which has the following five methods by default: `get()`, `query()`, `save()`, `remove()`, `delete()` (delete is an alias for remove)

Now we can use the `get()`, `query()`, `save()`, and `delete()` methods in our `BooksController` controller!

`controllers.js`

```js
  angular
    .module('bookApp')
    .controller('BooksController', BooksController);

  function BooksController (Book) {
    this.newBook = {}; // will hold user input for new book
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
      // TODO: clear the form!
      // TODO: display the new book in the list of books!
    };

    function deleteBook(book) {
      Book.remove({id:book._id});
      var bookIndex = this.books.indexOf(book);
      this.books.splice(bookIndex, 1);
    };

    console.log("Controller loaded.");
    };
```

  The `get()` function in the above snippet issues a GET request to `/books/:id`.

  The function `query()` issues a GET request to `/books` (notice there is no `:id`).

  The `save()` function issues a POST request to `/books` with the first argument as the book data. The second argument is a callback which is called when the data is saved.

1. We are good to go for the create, read and delete parts of CRUD. However, since update can use either PUT or PATCH, we need to modify our custom factory `Book` as shown below.

`services.js`

  ```js
  angular.module('bookApp').factory('Book', BookFactory);

  function BookFactory($resource) {
    return $resource('https://super-crud.herokuapp.com/books/:id', { id: '@_id' }, {
      update: {
        method: 'PUT' // this method issues a PUT request
      },
      query: {
        isArray: true,
        transformResponse: function(data) {
            return angular.fromJson(data).books; // this grabs the books from the response data: `{books: [...]}`
        }
      }
    });
  });
  ```

> Note: `{ id: "@_id"}` is a mapping between the placeholder in our route (e.g. `/books/:id)` and the name of the key that holds the id in the book object. And since the database is mongoDB our id is `_id`.

Now that we're all set, you're ready to tackle the challenges!

## Book CRUD Challenges

1. Display all the books with all their attributes including the photo.
1. Create a form to add a new book. Make it work!
1. Add an edit button next to each book. Make it work!
1. Add a delete button next to each book. Make it work!

## Bonuses

1. Can you modify (aka "transformResponse" ) the incoming list of books and change `_id` to `id` _before_ it gets to the controller?
1. Can you create a seperate view for each book? I.E. Each title should link to a view that shows only the details for that book (`localhost:8000/#/books/10`). **Hints:**  
    - Use `ui-router` and `ng-view` to set up multiple views in your Angular app.
    - Use `$routeParams` to figure out which book to display.
    - Your view for a single book will have a different controller than your view that displays all books.
