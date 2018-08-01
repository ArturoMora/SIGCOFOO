/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
FooEntitiesService nombre de factory en ENTITIES.service.js
"iie.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    
    var app = angular.module("iie.services");
    app.factory("FooEntitiesService", ["$http", "API", FooEntitiesService]);

    function FooEntitiesService($http, API) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var service = {};

        // Get 
        service.get = function (FooID) {
            var endpoint = API + "FooController/get/" + FooID;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "FooController/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "FooController/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.get = function () {
            var endpoint = API + "FooController/getAll";
            return $http.get(endpoint);
        };



        // Delete
        service.delete = function (FooID) {
            var endpoint = API + "FooController/delete/" + FooID;
            return $http.delete(endpoint);
        }

        return service;

    }

}());