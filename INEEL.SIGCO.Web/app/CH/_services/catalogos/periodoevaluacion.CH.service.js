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
        .factory("periodoevaluacionService", ["$http", "globalGet", periodoevaluacionService]);

    function periodoevaluacionService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (id) {
            var endpoint = API + "PeriodoEvaluacion/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByDescripcion = function (id) {
            var endpoint = API + "PeriodoEvaluacion/GetByDescripcion/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.Update = function (Registro) {
            var endpoint = API + "PeriodoEvaluacion/Update/" + Registro;
            return $http.put(endpoint, Registro);
        }

        // Create
        service.Add = function (Registro) {
            var endpoint = API + "PeriodoEvaluacion/Create/" + Registro;
            return $http.post(endpoint, Registro);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "PeriodoEvaluacion/GetAll";
            return $http.get(endpoint);
        };
                     
        // Get FooEntities
        service.getAllTecnicas = function () {
            var endpoint = API + "PeriodoEvaluacion/GetAllTecnicas";
            return $http.get(endpoint);
        };

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "PeriodoEvaluacion/UpdateEstado/" + Registro;
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