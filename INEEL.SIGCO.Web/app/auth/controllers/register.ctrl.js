﻿(function () {
    "use strict";

    var app = angular.module("ineel");

    app.controller("RegisterCtrl", ["$scope", "$state", "$stateParams", "$timeout", "AuthService", RegisterCtrl]);

    function RegisterCtrl($scope, $state, $stateParams, $timeout, AuthService) {

        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.registration = {
            userName: "",
            password: "",
            confirmPassword: ""
        };

        $scope.signUp = function () {

            AuthService.saveRegistration($scope.registration).then(
                function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
                    //startTimer();
                    //$state.go('login');
                    window.location = "/index.html#/login";
                },
                function (response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    $scope.message = "Failed to register user due to:" + errors.join(' ');
             });
        };

        //var startTimer = function () {
        //    var timer = $timeout(function () {
        //        $timeout.cancel(timer);
        //        $state.go('login');
        //    }, 1);
        //}

    }


}());