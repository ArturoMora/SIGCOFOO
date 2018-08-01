(function () {
    "use strict";

    var app = angular.module("ineel.services");

    app.factory('authInterceptorService', ['$q', '$location', 'localStorageService', authInterceptorService]);

    function authInterceptorService($q, $location, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData && _logueadohoy(authData)) {
                config.headers.Authorization = 'Bearer ' + authData.token;
                try {
                    if (typeof authData.userprofile != "undefined") {
                        if (authData.userprofile != null) {
                            config.headers.UsuarioId = authData.userprofile.clavePersona;
                            config.headers.NombreCompleto = authData.userprofile.nombreCompleto;
                            config.headers.userName = authData.userName
                        }
                    }


                } catch (e) {
                    console.log("errAch");
                    console.log(e);
                }
            }
            return config;
        }
        var _requestServerSide = function () {
            var headers = {
                "Authorization": 'BearerFOO',
                "UsuarioId": "Anonimo",
                "NombreCompleto": "Anonimo"
            };
            var authData = localStorageService.get('authorizationData');
            if (authData && _logueadohoy(authData)) {
                headers.Authorization = 'Bearer ' + authData.token;
                try {
                    if (typeof authData.userprofile != "undefined") {
                        if (authData.userprofile != null) {
                            headers.UsuarioId = authData.userprofile.clavePersona;
                            headers.NombreCompleto = authData.userprofile.nombreCompleto;
                        }
                    }
                } catch (e) {
                }
            }
            return headers;
        }

        var _responseError = function (rejection) {
            try {
                if (rejection.status == 401) {
                    toastr.error("No autorizado", "autenticación inválida o caducada");
                    localStorageService.remove('authorizationData');
                    window.location = "/index.html#/login";
                }
            } catch (e) { }

            if (rejection.data != null)
                console.log(rejection);
            if (rejection.status < 0) {
                toastr.error("se ha negado la conexión", "Verificar la disponibilidad del servidor");
            } else
                if (rejection.status === 401) {
                    window.location = "/index.html#/login";
                } else if (rejection.status === 400) {
                    console.log("400: " + rejection);
                }
            return $q.reject(rejection);
        }

        var _logueadohoy = function (authData) {
            if (authData !== null && authData.ultimologin !== undefined) {
                var ultimologin = new Date(authData.ultimologin);
                var today = new Date();
                if (ultimologin.toDateString() !== today.toDateString()) {
                    localStorageService.remove('authorizationData');
                   window.location = "/index.html#/login";
                }
                return true;
            } else {
                localStorageService.remove('authorizationData');
                window.location = "/index.html#/login";
            }
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;
        authInterceptorServiceFactory.requestServerSide = _requestServerSide;

        return authInterceptorServiceFactory;
    }

})();
