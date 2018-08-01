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
        .factory("evaluacionconductualService", ["$http", "globalGet", evaluacionconductualService]);
    
    function evaluacionconductualService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        service.getById = function (id) {
            var endpoint = API + "EvaluacionConductual/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByUnidadPeriodo = function (obj) {
            var endpoint = API + "EvaluacionConductual/GetByUnidadPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByCategoriaPeriodo = function (obj) {
            var endpoint = API + "EvaluacionConductual/GetByCategoriaPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByPersonaPeriodo = function (obj) {
            var endpoint = API + "EvaluacionConductual/GetByPersonaPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }
        
        service.getTodosByUnidadPeriodo = function (obj) {
            var endpoint = API + "EvaluacionConductual/GetTodosByUnidadPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getPromedioCompetencias = function (obj) {
            var endpoint = API + "EvaluacionConductual/GetPromedioCompetencias/" + obj;
            return $http.post(endpoint,obj);
        }


        service.getMisEvaluacionesConductuales = function (obj) {
            var endpoint = API + "ListaEmpleadosSind/MisEvaluacionesConductuales/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByClaveCategoria = function (id) {
            var endpoint = API + "EvaluacionConductual/GetByClaveCategoria/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "EvaluacionConductual/Update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (obj) {
            var endpoint = API + "EvaluacionConductual/create";
            return $http.post(endpoint, obj);
        }
                
        service.duplicarCompetencias = function (id) {
            var endpoint = API + "EvaluacionConductual/duplicarCompetencias/" + id;
            return $http.get(endpoint);
        }
        service.duplicarFamilias = function (id) {
            var endpoint = API + "EvaluacionConductual/duplicarFamilias/" + id;
            return $http.get(endpoint);
        }
        service.duplicarCategorias = function (id) {
            var endpoint = API + "EvaluacionConductual/duplicarCategorias/" + id;
            return $http.get(endpoint);
        }
        service.duplicarMatriz = function (id) {
            var endpoint = API + "EvaluacionConductual/duplicarMatriz/" + id;
            return $http.get(endpoint);
        }
        service.cargarEmpleadosPeriodo = function (id) {
            var endpoint = API + "EvaluacionConductual/cargarEmpleadosPeriodo/" + id;
            return $http.get(endpoint);
        }
        service.organizarFortalezas = function () {
            var endpoint = API + "EvaluacionConductual/OrganizaPlanesMejorasFortalezas";
            return $http.get(endpoint);
        }
        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "EvaluacionConductual/getAll";
            return $http.get(endpoint);
        };
        
        // Delete
        service.delete = function (id) {
            var endpoint = API + "EvaluacionConductual/delete/" + id;
            return $http.delete(endpoint);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "EvaluacionConductual/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }


        service.CompetenciasConductualesResultadosPeriodo = function (obj) {
            var endPoint = API + "EvaluacionConductual/GraficaResultadosPeriodo/" + obj;
            return $http.post(endPoint,obj);         
        }

        return service;

    }

}());