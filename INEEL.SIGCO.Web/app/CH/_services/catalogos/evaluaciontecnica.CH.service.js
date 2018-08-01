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
        .factory("evaluaciontecnicaService", ["$http", "globalGet", evaluaciontecnicaService]);

    function evaluaciontecnicaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "EvaluacionTecnicas/getAll";
            return $http.get(endpoint);
        }

        service.getById = function (id) {
            var endpoint = API + "EvaluacionTecnicas/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByNivel = function (id) {
            var endpoint = API + "EvaluacionTecnicas/GetByNivel/" + id;
            return $http.get(endpoint);
        }

        service.getByUnidadPeriodo = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/GetByUnidadPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByPersonaPeriodo = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/GetByPersonaPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByAreaPeriodo = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/GetByAreaPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getTodosByUnidadPeriodo = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/GetTodosByUnidadPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.cargarEmpleadosPeriodo = function (id) {
            var endpoint = API + "EvaluacionTecnicas/cargarEmpleadosPeriodo/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "EvaluacionTecnicas/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
       
        service.CompetenciasConductualesResultadosPeriodo = function (obj) {
            var endPoint = API + "EvaluacionTecnicas/GraficaResultadosPeriodo/" + obj;
            return $http.post(endPoint, obj);
        }

        return service;


    }

}());