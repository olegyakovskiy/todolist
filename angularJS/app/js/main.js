var library = angular.module("todolist", ["ngRoute"]);

library.config(function($routeProvider) {
    $routeProvider
        .when("/home",  {templateUrl : "view/overview.html", controller: "overviewCtrl"})
        .when("/tasks",  {templateUrl : "view/tasks.html", controller: "taskCtrl"})
        .when("/settings", {templateUrl : "view/settings.html", controller: "settingsCtrl"})
        .otherwise({redirectTo: '/home'})
});

library.controller("overviewCtrl", function ($scope) {
    $scope.title = "Welcome";
});

library.controller("settingsCtrl", function ($scope) {
    $scope.title = "Settings";
});

library.controller("taskCtrl", function ($scope, $http) {
    $scope.title = "Tasks";

    var serverUrl = "http://localhost:3000";

    $scope.saveTask = function () {
        $scope.errorText = "";
        var newTask = $scope.newTask.trim();
        var exists = containsTask(newTask);
        if (exists == true) {
            $scope.errorText = "Task with this name already exists";
        }
        else {
            $scope.errorText = "";
            $http.post(serverUrl + "/add", {name: newTask}).then(function () {
                loadTasks();
            });
            $scope.newTask = "";
        }
    };

    $scope.removeTask = function (index) {
        var taskId = $scope.tasks[index]._id;
        $http.post(serverUrl + "/remove", {taskId: taskId}).then(function () {
            loadTasks();
        })
    };

    function containsTask(name) {
        var nameUp = name.toUpperCase();
        var taskExists = false;
        $scope.tasks.forEach(function (task) {
            if (task.name.toUpperCase() == nameUp) {
                taskExists = true;
            }
        });
        return taskExists;
    }

    function loadTasks() {
        $http.get(serverUrl).then(function (res) {
            $scope.tasks = (res.data === undefined) ? [] : res.data;
        });
    }

    loadTasks();
});


