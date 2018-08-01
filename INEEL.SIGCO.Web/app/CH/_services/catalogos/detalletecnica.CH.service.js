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
        .factory("detalletecnicaService", ["$http", "globalGet", detalletecnicaService]);

    function detalletecnicaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "DetalleEvaluacionTecnicas/getAll";
            return $http.get(endpoint);
        }

        service.getById = function (id) {
            var endpoint = API + "DetalleEvaluacionTecnicas/GetById/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "DetalleEvaluacionTecnicas/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        service.getByEmpleado = function (obj) {
            var endpoint = API + "DetalleEvaluacionTecnicas/GetByEmpleado/" + obj;
            return $http.post(endpoint, obj);
        }


        service.getByEmpleadoAuxiliar = function (obj) {
            var endpoint = API + "DetalleEvaluacionTecnicas/GetByEmpleadoAuxiliar/" + obj;
            return $http.post(endpoint, obj);
        }

        // Create
        service.add = function (obj) {
            var endpoint = API + "DetalleEvaluacionTecnicas/Create/" + obj;
            return $http.post(endpoint, obj);
        }

       
        return service;


    }

}());