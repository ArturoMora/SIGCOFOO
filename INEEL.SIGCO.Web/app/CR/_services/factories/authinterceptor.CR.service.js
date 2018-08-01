(function () {
    "use strict";

    var app = angular.module("ineel.CR.services");

    app.factory('authInterceptorServiceCR', ['$q', '$location', 'localStorageService', authInterceptorServiceCR]);

    function authInterceptorServiceCR($q, $location, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        var _responseError = function (rejection) {
            console.log(rejection.data.error);

            if (rejection.status === 401) {
                $location.path('/login');
            } else if (rejection.status === 400) {
                console.log("400: " + rejection);
            }
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }

})();
