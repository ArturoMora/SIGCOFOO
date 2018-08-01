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
        .factory("competenciatecnicaService", ["$http", "globalGet", competenciatecnicaService]);

    function competenciatecnicaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (id) {
            var endpoint = API + "CompetenciaTecnica/GetById/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (Registro) {
            var endpoint = API + "CompetenciaTecnica/Update/";
            return $http.put(endpoint, Registro);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "CompetenciaTecnica/Create/";
            return $http.post(endpoint, Registro);
        }

        
        service.getByPeriodoArea = function (Registro) {
            var endpoint = API + "CompetenciaTecnica/GetByPeriodoArea/" + Registro;
            return $http.post(endpoint, Registro);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "CompetenciaTecnica/getAll";
            return $http.get(endpoint);
        };

        service.getByPeriodo = function (id) {
            var endpoint = API + "CompetenciaTecnica/GetByPeriodo/" + id;
            return $http.get(endpoint);
        };


        service.updateEstado = function (Registro) {
            var endPoint = API + "CompetenciaTecnica/UpdateEstado/" + Registro;
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