/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
CalificacionPersonal nombre de factory en ENTITIES.service.js
"ineelMT.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    
    var app = angular.module("ineel.MT.services");
    app.factory("CalificacionPersonalService", ["$http", "globalGet", CalificacionPersonal]);

    function CalificacionPersonal($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (FooID) {
            var endpoint = API + "CalificacionPersonal/get/" + FooID;
            return $http.get(endpoint);
        }
               

        // Update
        service.update = function (model) {
            var endpoint = API + "CalificacionPersonal/Update";
            return $http.put(endpoint, model);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "CalificacionPersonal/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "CalificacionPersonal/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "CalificacionPersonal/GetAll";
            return $http.get(endpoint);
        };

        
        // Delete
        service.delete = function (FooID) {
            var endpoint = API + "CalificacionPersonal/delete/" + FooID;
            return $http.delete(endpoint);
        }

        return service;

    }

}());