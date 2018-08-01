(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('PersonaService', ['$http', '$q', 'globalGet', 'AuthService', 'localStorageService', PersonaService]);

    function PersonaService($http, $q, globalGet, AuthService, localStorageService) {
        var API = globalGet.get("api");

        var service = {};
        
        service.getDatos = function (username) {
            
            var q = $q.defer();
            try {
                console.log("ach:");
                console.log(API + 'Personas/GetByRU/' + username);
                
                $http.get(API + 'Personas/GetByRU/' + username)
                    .success(function (response) {
                        if (response != null) {
                            AuthService.authentication.nombreCompleto = response.nombreCompleto;
                            AuthService.authentication.userprofile = response;
                            
                            var authData = localStorageService.get('authorizationData');
                            authData.userprofile = AuthService.authentication.userprofile;
                            authData.nombreCompleto = AuthService.authentication.nombreCompleto;
                            localStorageService.set('authorizationData', authData);
                        }
                        else {
                            AuthService.logOut();
                            toastr.error("Error al cargar los datos del usuario...");
                        }
                        q.resolve(response);

                    })
                    .error(function (err, status) {
                        
                        toastr.error("Error al cargar los datos del usuario..." + "<br>" + err.messageDetail);
                        q.reject(err);
                    });
                return q.promise;
            } catch (e) {
                q.reject(err);
            }

        };

        service.getFuncionesOriginal = function (idrol) {
            var q = $q.defer();
            try {
                $http.get(API + 'Personas/GetFullRolByID/' + idrol)
                    .success(function (response) {
                        if (response != null) {
                            
                        }
                        else {
                            toastr.error("Error al cargar las funciones del usuario...");
                        }
                        q.resolve(response);

                    })
                    .error(function (err, status) {
                        toastr.error("Error al cargar las funciones del usuario..." + "<br>" + err.messageDetail);
                        q.reject(err);
                    });
                return q.promise;
            } catch (e) {
                q.reject(err);
            }

        }

        service.getFunciones = function (idrol,modulo) {
            var q = $q.defer();
            var url = API + 'Personas/GetFuncionesRol' + modulo + 'ByID/' + idrol;
            try {
                $http.get(url)
                    .success(function (response) {
                        if (response != null) {
                            
                        }
                        else {
                            toastr.error("Error al cargar las funciones del usuario...");
                        }
                        q.resolve(response);

                    })
                    .error(function (err, status) {
                        toastr.error("Error al cargar las funciones del usuario..." + "<br>" + err.messageDetail);
                        q.reject(err);
                    });
                return q.promise;
            } catch (e) {
                q.reject(err);
            }

        }

        return service;

    }

})();