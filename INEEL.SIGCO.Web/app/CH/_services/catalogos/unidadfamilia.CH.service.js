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
        .factory("unidadfamiliaService", ["$http", "globalGet", unidadfamiliaService]);

    function unidadfamiliaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "UnidadFamilia/GetAll";
            return $http.get(endpoint);
        }

        service.getByFamilia = function (id) {
            var endpoint = API + "UnidadFamilia/GetByFamilia/" + id;
            return $http.get(endpoint);
        }

        service.getByUnidad = function (obj) {
            var endpoint = API + "UnidadFamilia/GetByUnidad/";
            return $http.post(endpoint, obj);
        }

        service.getById = function (id) {
            var endpoint = API + "UnidadFamilia/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByPeriodo = function (id) {
            var endpoint = API + "UnidadFamilia/GetByPeriodo/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "UnidadFamilia/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "UnidadFamilia/Create/";
            return $http.post(endpoint, Registro);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "UnidadFamilia/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //eliminar registro 
        service.delete = function (id) {
            var endPoint = API + "UnidadFamilia/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        return service;

    }

}());