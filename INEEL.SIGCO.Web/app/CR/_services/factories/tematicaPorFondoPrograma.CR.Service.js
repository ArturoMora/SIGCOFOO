(function () {
    "use strict";
    
    angular
        .module("ineel.CR.services")
        .factory("TematicaPorFondoProgramaCRService", [
        "$http",
        "globalGet",
        TematicaPorFondoProgramaCRService
        ]);

    function TematicaPorFondoProgramaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (TematicaPorFondoProgramaId) {
            var endpoint = API + "TematicaPorFondoPrograma/get/" + TematicaPorFondoProgramaId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "TematicaPorFondoPrograma/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "TematicaPorFondoPrograma/create";
            return $http.post(endpoint, model);
        }

        // Get 
        service.get = function () {
            var endpoint = API + "TematicaPorFondoPrograma/getAll";
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (TematicaPorFondoProgramaId) {
            var endpoint = API + "TematicaPorFondoPrograma/delete/" + TematicaPorFondoProgramaId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TematicaPorFondoPrograma/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }
        return service;

    }

}());