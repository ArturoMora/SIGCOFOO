(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TipoRelacionCRService", [
        "$http",
        "globalGet",
        TipoRelacionCRService
        ]);

    function TipoRelacionCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // GetAll
        service.getAll = function () {
            var endpoint = API + "TipoRelacion/GetAll";
            return $http.get(endpoint);
        };

        // Get 
        service.get = function (TipoRelacionId) {
            var endpoint = API + "TipoRelacion/Get/" + TipoRelacionId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "TipoRelacion/Update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "TipoRelacion/Create/";
            return $http.post(endpoint, model);
        }

        // Delete
        service.delete = function (TipoRelacionId) {
            var endpoint = API + "TipoRelacion/Delete/" + TipoRelacionId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TipoRelacion/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());