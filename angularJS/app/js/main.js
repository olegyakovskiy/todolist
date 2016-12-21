var library = angular.module("library", ["ngRoute"]);

library.config(function($routeProvider) {
    $routeProvider
        .when("/home",  {templateUrl : "view/overview.html", controller: "overviewCtrl"})
        .when("/books",  {templateUrl : "view/books.html", controller: "bookCtrl"})
        .when("/labels", {templateUrl : "view/labels.html", controller: "labelCtrl"})
        .otherwise({redirectTo: '/home'})
});

library.controller("overviewCtrl", function ($scope) {
    $scope.title = "Welcome";
});

library.controller("labelCtrl", function ($scope) {
    $scope.title = "Labels";
});

library.controller("bookCtrl", function ($scope, $http) {
    $scope.title = "Books";

    var serverUrl = "http://localhost:3000";

    $scope.saveBook = function () {
        $scope.errorText = "";
        var newBook = $scope.newBook.trim();
        var exists = containsBook(newBook);
        if (exists == true) {
            $scope.errorText = "Book with this name already exists";
        }
        else {
            $scope.errorText = "";
            $http.post(serverUrl + "/add", {name: newBook}).then(function () {
                loadBooks();
            });
            $scope.newBook = "";
        }
    };

    $scope.removeBook = function (index) {
        var bookId = $scope.books[index]._id;
        $http.post(serverUrl + "/remove", {bookId: bookId}).then(function () {
            loadBooks();
        })
    };

    function containsBook(bookName) {
        var bookNameUp = bookName.toUpperCase();
        var bookExists = false;
        $scope.books.forEach(function (book) {
            if (book.name.toUpperCase() == bookNameUp) {
                bookExists = true;
            }
        });
        return bookExists;
    }

    function loadBooks() {
        $http.get(serverUrl).then(function (res) {
            $scope.books = res.data;
        });
    }

    loadBooks();
});


