(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TipoConvenioCRService", [
        "$http",
        "globalGet",
        TipoConvenioCRService
        ]);

    function TipoConvenioCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (convenioId) {
            var endpoint = API + "TipoConvenio/get/" + convenioId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "TipoConvenio/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "TipoConvenio/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "TipoConvenio/getAll";
            return $http.get(endpoint);
        };

        // Get FooEntities
        service.getAllByEstado = function () {
            var endpoint = API + "TipoConvenio/getAllByEstado";
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (convenioId) {
            var endpoint = API + "TipoConvenio/delete/" + convenioId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TipoConvenio/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());