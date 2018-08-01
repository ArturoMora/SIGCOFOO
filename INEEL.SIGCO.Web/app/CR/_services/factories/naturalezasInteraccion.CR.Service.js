(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("NaturalezasInteraccionCRService", [
        "$http",
        "globalGet",
        NaturalezasInteraccionCRService
        ]);

    function NaturalezasInteraccionCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get NaturalezasInteraccion
        service.getNaturalezasInteraccion = function () {
            var endpoint = API + "NaturalezaInteraccion/GetAll";
            return $http.get(endpoint);
        };

        // Get NaturalezasInteraccion
        service.getNaturalezaInteraccion = function (naturalezaInteraccionId) {
            var endpoint = API + "NaturalezaInteraccion/Get/" + naturalezaInteraccionId;
            return $http.get(endpoint);
        }

        //Create NaturalezasInteraccion
        service.create = function (naturalezaInteraccion) {
            var endpoint = API + "NaturalezaInteraccion/Create/" + naturalezaInteraccion;
            return $http.post(endpoint, naturalezaInteraccion);
        }

        // Update NaturalezasInteraccion
        service.update = function (naturalezaInteraccion) {
            var endpoint = API + "NaturalezaInteraccion/Update";
            return $http.put(endpoint, naturalezaInteraccion);
        }

        // Delete NaturalezasInteraccion
        service.delete = function (naturalezaInteraccionId) {
            var endpoint = API + "NaturalezaInteraccion/Delete/" + naturalezaInteraccionId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "NaturalezaInteraccion/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());