(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TituloPersonaCRService", [
        "$http",
        "globalGet",
        TituloPersonaCRService
        ]);

    function TituloPersonaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // GetAll
        service.getAll = function () {
            var endpoint = API + "TituloPersona/GetAll";
            return $http.get(endpoint);
        };

        // GetAllActivos
        service.getallactivos = function () {
            var endpoint = API + "TituloPersona/GetAllActivos";
            return $http.get(endpoint);
        };

        // Get 
        service.getById = function (TipoRelacionId) {
            var endpoint = API + "TituloPersona/GetById/" + TipoRelacionId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "TituloPersona/Update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "TituloPersona/Create/";
            return $http.post(endpoint, model);
        }

        // Delete
        service.delete = function (TipoRelacionId) {
            var endpoint = API + "TituloPersona/Delete/" + TipoRelacionId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TituloPersona/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());