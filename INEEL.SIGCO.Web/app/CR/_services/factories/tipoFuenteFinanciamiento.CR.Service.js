(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TipoFuenteFinanciamientoCRService", [
        "$http",
        "globalGet",
        TipoFuenteFinanciamientoCRService
        ]);

    function TipoFuenteFinanciamientoCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (tipoFuenteFinanciamientoId) {
            var endpoint = API + "TipoFuenteFinanciamiento/get/" + tipoFuenteFinanciamientoId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "TipoFuenteFinanciamiento/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "TipoFuenteFinanciamiento/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "TipoFuenteFinanciamiento/getAll";
            return $http.get(endpoint);
        };


        // Delete
        service.delete = function (tipoFuenteFinanciamientoId) {
            var endpoint = API + "TipoFuenteFinanciamiento/delete/" + tipoFuenteFinanciamientoId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TipoFuenteFinanciamiento/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }


        return service;

    }

}());