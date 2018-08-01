(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ContactosPorConvocatoriaCRService", [
        "$http",
        "globalGet",
        ContactosPorConvocatoriaCRService
        ]);

    function ContactosPorConvocatoriaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Convocatorias
        service.getContactosPorConvocatoria = function () {
            var endpoint = API + "ContactoPorConvocatoria/GetAll";
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKs
        service.getContactosPorConvocatoriaAllFKs = function () {
            var endpoint = API + "ContactoPorConvocatoria/GetAllFKs/";
            return $http.get(endpoint);
        };

        // Get ConvocatoriaById
        service.getContactoPorConvocatoria = function (ContactoPorConvocatoriaId) {
            var endpoint = API + "ContactoPorConvocatoria/Get/" + ContactoPorConvocatoriaId;
            return $http.get(endpoint);
        }

        //Create Convocatoria
        service.create = function (ContactoPorConvocatoria) {
            var endpoint = API + "ContactoPorConvocatoria/Create/" + ContactoPorConvocatoria;
            return $http.post(endpoint, ContactoPorConvocatoria);
        }

        // Update Convocatoria
        service.update = function (ContactoPorConvocatoria) {
            var endpoint = API + "ContactoPorConvocatoria/Update";
            return $http.put(endpoint, ContactoPorConvocatoria);
        }

        // Delete Convocatoria
        service.delete = function (ContactoPorConvocatoriaId) {
            var endpoint = API + "ContactoPorConvocatoria/Delete/" + ContactoPorConvocatoriaId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "ContactoPorConvocatoria/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;
    }

}());