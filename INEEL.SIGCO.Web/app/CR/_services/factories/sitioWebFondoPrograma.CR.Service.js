(function () {
    "use strict";
    
    angular
        .module("ineel.CR.services")
        .factory("SitioWebFondoProgramaCRService", [
        "$http",
        "globalGet",
        SitioWebFondoProgramaCRService
        ]);

    function SitioWebFondoProgramaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (SitioWebFondoProgramaId) {
            var endpoint = API + "SitioWebFondoPrograma/get/" + SitioWebFondoProgramaId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "SitioWebFondoPrograma/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "SitioWebFondoPrograma/create";
            return $http.post(endpoint, model);
        }

        // GetAll
        service.getAll = function () {
            var endpoint = API + "SitioWebFondoPrograma/getAll";
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (SitioWebFondoProgramaId) {
            var endpoint = API + "SitioWebFondoPrograma/delete/" + SitioWebFondoProgramaId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "SitioWebFondoPrograma/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());