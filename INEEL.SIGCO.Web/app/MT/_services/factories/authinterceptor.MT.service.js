(function () {
    "use strict";

    var app = angular.module("ineel.MT.services");

    app.factory('authInterceptorServiceMT', ['$q', '$location', 'localStorageService', authInterceptorServiceMT]);

    function authInterceptorServiceMT($q, $location, localStorageService) {

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
            console.log("MT _responseError:"+rejection);
            debugger;
            if (rejection.status === 401) {
                $location.path('/login');
            } else if (rejection.status === 400) {
                console.log("400: ");
                console.log(rejection);
            } else if (rejection.status === 500) {
                console.log("500: ");
                console.log(rejection);
            }
            try{
                toastr.warning("(" + rejection.status + ") " + rejection.data.message, "Error al procesar su solicitud");
            }catch(e){}            
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }

})();
