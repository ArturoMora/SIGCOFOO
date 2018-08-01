(function () {
    "use strict";

    var app = angular.module("ineel.CR.services");

    app.factory('AuthServiceCR', ['$http', 'globalGet', '$q', 'localStorageService', AuthServiceCR]);



    function AuthServiceCR($http, globalGet, $q, localStorageService) {
        var API = globalGet.get("api");
        var service = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            nombreCompleto:""
        };

        var _logOut = function () {
            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.nombreCompleto = "";
        };

//        var _fillAuthData = function () {
            console.log("_fillAuthDataCR...");
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                console.log("authDataCR!=null");
                $http.get(API + 'Usuario/getUsuario/' + authData.userName).
                              success(function (data) {
                                  //nombreUsuarioLogin = data.nombreEmpleado;
                                  _authentication.nombreCompleto = data.nombreEmpleado + " " + data.apellidoPaterno + " " + data.apellidoMaterno;
                              });
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            } else {
                console.log("authDataCR==null");
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