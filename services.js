angular
  .module('bookApp')
  .service('Book', BookFactory);


function BookFactory($resource) {
  return $resource('https://super-crud.herokuapp.com/books/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    },
    query: {
      isArray: true,
      transformResponse: function(data) {
          return angular.fromJson(data).books;
      }
    }
  });
}
