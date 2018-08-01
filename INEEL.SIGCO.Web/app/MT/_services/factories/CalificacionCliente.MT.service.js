/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
CalificacionCliente nombre de factory en ENTITIES.service.js
"ineelMT.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    
    var app = angular.module("ineel.MT.services");
    app.factory("CalificacionClienteService", ["$http", "globalGet", CalificacionCliente]);

    function CalificacionCliente($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (FooID) {
            var endpoint = API + "CalificacionCliente/GetById/" + FooID;
            return $http.get(endpoint);
        }


        // Update
        service.update = function (model) {
            var endpoint = API + "CalificacionCliente/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "CalificacionCliente/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "CalificacionCliente/GetAll";
            return $http.get(endpoint);
        };
        

        // Delete
        service.delete = function (FooID) {
            var endpoint = API + "CalificacionCliente/delete/" + FooID;
            return $http.delete(endpoint);
        }


        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "CalificacionCliente/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }

}());