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
    angular
        .module("ineel.CH.services")
        .factory("estadoevaluacionService", ["$http", "globalGet", estadoevaluacionService]);

    function estadoevaluacionService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (id) {
            var endpoint = API + "EstadoEvaluacion/GetById/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (Registro) {
            var endpoint = API + "EstadoEvaluacion/Update";
            return $http.put(endpoint, Registro);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "EstadoEvaluacion/Create/" + Registro;
            return $http.post(endpoint, Registro);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "EstadoEvaluacion/GetAll";
            return $http.get(endpoint);
        };


        //Actualizar estado
        service.updateEstado = function (Registro) {
            var endPoint = API + "EstadoEvaluacion/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        // Delete
        //service.delete = function (FooID) {
        //    var endpoint = API + "FooController/delete/" + FooID;
        //    return $http.delete(endpoint);
        //}

        return service;

    }

}());