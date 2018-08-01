(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('AuthService', ['$http', '$q', 'localStorageService', 'globalGet', AuthService]);

    function AuthService($http, $q, localStorageService, globalGet) {
        var API = globalGet.get("api");

        var service = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            ultimologin: "",
            nombreCompleto: "",
            userprofile: {}
        };

        var _saveRegistration = function (registration) {
            _logOut();
            return $http.post(globalGet.get("api") + 'account/register', registration).then(
                function (response) {
                    return response;
                });
        };

        var _changepassword = function (loginData) {
            return $http.post(globalGet.get("api") + 'account/ChangePassword', loginData).then(
                function (response) {
                    return response;
                });
        };

        var _verificaSesion = function () {
            var q = $q.defer();
            //return localStorageService.get('authorizationData');
            var datos = localStorageService.get('authorizationData');
            q.resolve(datos);
            return q.promise;
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var q = $q.defer();
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

            $http.post(globalGet.get("token"), data, headers).success(
                function (response) {
                    var authData = { token: response.access_token, userName: loginData.userName , ultimologin :new Date() };
                    localStorageService.set('authorizationData', authData);

                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;

                    q.resolve(response);

                }).error(function (err, status) {
                    //_logOut();

                    q.reject(err);
                });

            return q.promise;
        };
        var _logOut = function () {
            //toastr.warning("cerrando sesi&oacute;n");
            localStorageService.remove('authorizationData');
            localStorageService.remove('descripcionRol');
            localStorageService.remove('MenuListADM');
            localStorageService.remove('MenuListCH');
            localStorageService.remove('MenuListCR');
            localStorageService.remove('MenuListMT');
            localStorageService.remove('MenuListCP');
            localStorage.clear(); //importante para remover todo incluyendo MenuService._setVariable
            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.userprofile = {};
            _authentication.nombreCompleto = "";
        };


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.userprofile = authData.userprofile;
            _authentication.nombreCompleto = authData.nombreCompleto;
            _authentication.ultimologin = authData.ultimologin;
        }

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                // console.log("authData!=null");
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.userprofile = authData.userprofile;
                _authentication.nombreCompleto = authData.nombreCompleto;
                _authentication.ultimologin = authData.ultimologin;
            } else {
                console.log("authData==null");
            }
        };



        service.saveRegistration = _saveRegistration;
        service.login = _login;
        service.logOut = _logOut;
        service.fillAuthData = _fillAuthData;
        service.authentication = _authentication;
        service.changepassword = _changepassword;
        service.verificaSesion = _verificaSesion;

        return service;

    }




})();