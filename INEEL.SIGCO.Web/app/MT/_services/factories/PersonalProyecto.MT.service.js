/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
PersonalProyecto nombre de factory en ENTITIES.service.js
"ineelMT.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    
    var app = angular.module("ineel.MT.services");
    app.factory("PersonalProyectoService", ["$http", "globalGet", PersonalProyecto]);

    function PersonalProyecto($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function (FooID) {
            var endpoint = API + "PersonalProyecto/get/" + FooID;
            return $http.get(endpoint);
        }


        

        // Update
        service.update = function (model) {
            var endpoint = API + "PersonalProyecto/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "PersonalProyecto/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.get = function () {
            var endpoint = API + "PersonalProyecto/GetAll";
            return $http.get(endpoint);
        };

        service.getProyPersonas = function (id) {
            var endpoint = API + "PersonalProyecto/GetProyPersonas/"+id;
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (FooID) {
            var endpoint = API + "PersonalProyecto/delete/" + FooID;
            return $http.delete(endpoint);
        }

        return service;

    }

}());