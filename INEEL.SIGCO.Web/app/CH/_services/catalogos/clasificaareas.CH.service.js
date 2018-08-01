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
        .factory("clasificaareasService", ["$http", "globalGet", clasificaareasService]);

    function clasificaareasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (id) {
            var endpoint = API + "ClasificaAreas/GetById/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (Registro) {
            var endpoint = API + "ClasificaAreas/Update";
            return $http.put(endpoint, Registro);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "ClasificaAreas/Create/" + Registro;
            return $http.post(endpoint, Registro);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "ClasificaAreas/GetAll";
            return $http.get(endpoint);
        };

        // Get by year
        service.getByPeriodo = function (id) {
            var endpoint = API + "ClasificaAreas/GetByPeriodo/" + id;
            return $http.get(endpoint);
        };

        service.getByTipoArea = function (obj) {
            var endpoint = API + "ClasificaAreas/GetByTipoArea/" + obj;
            return $http.post(endpoint, obj);
        }

        //Actualizar estado
        service.updateEstado = function (Registro) {
            var endPoint = API + "ClasificaAreas/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //eliminar registro 
        service.delete = function (id) {
            var endPoint = API + "ClasificaAreas/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        return service;

    }

}());