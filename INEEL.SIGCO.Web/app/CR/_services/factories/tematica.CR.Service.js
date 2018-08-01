(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TematicaCRService", [
        "$http",
        "globalGet",
        TematicaCRService
        ]);

    function TematicaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (tematicaId) {
            var endpoint = API + "Tematica/get/" + tematicaId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "Tematica/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "Tematica/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "Tematica/getAll";
            return $http.get(endpoint);
        };
        //Obtener todas las Tematicas con estado Activo(1)
        service.getAllByEstado = function () {
            var endPoint = API + "Tematica/GetAllByEstado";
            return $http.get(endPoint);
        }
        // Delete
        service.delete = function (tematicaId) {
            var endpoint = API + "Tematica/delete/" + tematicaId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Tematica/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());