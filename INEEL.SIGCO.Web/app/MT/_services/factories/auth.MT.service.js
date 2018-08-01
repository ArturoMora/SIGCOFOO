(function () {
    "use strict";

    var app = angular.module("ineel.MT.services");

    app.factory('AuthServiceMT', ['$http', 'globalGet', '$q', 'localStorageService', AuthServiceMT]);



    function AuthServiceMT($http, globalGet, $q, localStorageService) {
        var API = globalGet.get("api");
        var service = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            nombreCompleto: ""
        };

        var _logOut = function () {
            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.nombreCompleto = "";

        };


            console.log("_fillAuthDataMT...");
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                console.log("authDataMT!=null");
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                
                $http.get(API + 'Usuario/getUsuario/' + authData.userName).
                            success(function (data) {                                
                                _authentication.nombreCompleto = data.nombreEmpleado + " " + data.apellidoPaterno + " " + data.apellidoMaterno;
                            });
            } else {
                console.log("authDataMT==null");
            }
    //    };



        //service.saveRegistration = _saveRegistration;
        //service.login = _login;
        service.logOut = _logOut;
        //service.fillAuthData = _fillAuthData;
        service.authentication = _authentication;

        return service;

    }

})();