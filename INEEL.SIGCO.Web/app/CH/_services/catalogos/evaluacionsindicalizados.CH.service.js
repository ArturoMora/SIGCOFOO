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
        .factory("evaluacionsindicalizadosService", ["$http", "globalGet", evaluacionsindicalizadosService]);

    function evaluacionsindicalizadosService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};
                      
        service.getPersonaById = function (id) {
            var endpoint = API + "ListaEmpleadosSind/GetById/" + id;
            return $http.get(endpoint);
        }
        
        service.getCompetencias = function (id) {
            var endpoint = API + "ListaEmpleadosSind/GetCompetencias/" + id;
            return $http.get(endpoint);
        }

        service.getPersonaByIdPeriodo = function (obj) {
            var endpoint = API + "ListaEmpleadosSind/GetByPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByCategoriaPeriodo = function (obj) {
            var endpoint = API + "EvaluacionCompetenciasSind/getByCategoriaPeriodo/" + obj;
            return $http.post(endpoint, obj);
        }

        return service;
    }

}());