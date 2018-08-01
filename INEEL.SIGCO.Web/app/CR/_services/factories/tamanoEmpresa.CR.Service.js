(function () {
    "use strict";
    
    angular
        .module("ineel.CR.services")
        .factory("TamanoEmpresaCRService", [
        "$http",
        "globalGet",
        TamanoEmpresaCRService
        ]);

    function TamanoEmpresaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (tamanoEmpresaId) {
            var endpoint = API + "TamanoEmpresa/get/" + tamanoEmpresaId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "TamanoEmpresa/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "TamanoEmpresa/create";
            return $http.post(endpoint, model);
        }

        // GetAll
        service.getAll = function () {
            var endpoint = API + "TamanoEmpresa/getAll";
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (tamanoEmpresaId) {
            var endpoint = API + "TamanoEmpresa/delete/" + tamanoEmpresaId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TamanoEmpresa/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());