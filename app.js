var app = angular.module("myApp", []);

app.controller("MainController", function ($scope, $http) {
    $scope.users = [];
    $scope.darkMode = localStorage.getItem("darkMode") === "true";

    // Fetch users
    $scope.fetchUsers = function () {
        $http.get("https://jsonplaceholder.typicode.com/users")
            .then(function (response) {
                $scope.users = response.data;
            });
    };

    // Save dark mode preference
    $scope.toggleDarkMode = function () {
        $scope.darkMode = !$scope.darkMode;
        localStorage.setItem("darkMode", $scope.darkMode);
    };
});

app.controller("ProfileController", function ($scope, $http, $location) {
    $scope.darkMode = localStorage.getItem("darkMode") === "true";
    $scope.user = {};

    // Get user ID from URL
    function getUserIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    var userId = getUserIdFromUrl();

    // Fetch user details
    $http.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(function (response) {
            $scope.user = response.data;
        });

    // Toggle Dark Mode
    $scope.toggleDarkMode = function () {
        $scope.darkMode = !$scope.darkMode;
        localStorage.setItem("darkMode", $scope.darkMode);
    };
});
