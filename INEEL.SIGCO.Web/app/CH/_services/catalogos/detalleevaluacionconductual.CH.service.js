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
        .factory("detalleevaluacionconductualService", ["$http", "globalGet", detalleevaluacionconductualService]);

    function detalleevaluacionconductualService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (id) {
            var endpoint = API + "DetalleEvaluacionConductual/get/" + id;
            return $http.get(endpoint);
        }

        service.getByClaveEvaluacion = function (id) {
            var endpoint = API + "DetalleEvaluacionConductual/GetByClaveEvaluacion/" + id;
            return $http.get(endpoint);
        }

        service.getByClaveEvaluacionResultado = function (id) {
            var endpoint = API + "DetalleEvaluacionConductual/GetByClaveEvaluacionResultado/" + id;
            return $http.get(endpoint);
        }
        
        // Update
        service.update = function (obj) {
            var endpoint = API + "DetalleEvaluacionConductual/update";
            return $http.put(endpoint, obj);
        }
              
        service.getByMatrizEvaluacion = function (obj) {
            var endpoint = API + "DetalleEvaluacionConductual/GetByMatrizEvaluacion/" + obj;
            return $http.post(endpoint, obj);
        }

        // Create
        service.create = function (obj) {
            var endpoint = API + "DetalleEvaluacionConductual/create";
            return $http.post(endpoint, obj);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "DetalleEvaluacionConductual/getAll";
            return $http.get(endpoint);
        };
                
        // Delete
        service.delete = function (id) {
            var endpoint = API + "DetalleEvaluacionConductual/delete/" + id;
            return $http.delete(endpoint);
        }

        return service;

    }

}());