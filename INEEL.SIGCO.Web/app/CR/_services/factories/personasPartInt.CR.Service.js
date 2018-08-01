(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("PersonasPartIntCRService", [
        "$http",
        "globalGet",
        PersonasPartIntCRService
        ]);

    function PersonasPartIntCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get PersonasPartInt
        service.getPersonasPartInt = function () {
            var endpoint = API + "PersonaPartInt/GetAll";
            return $http.get(endpoint);
        };
        // Get PersonasPartIntWithAllFKs
        service.getPersonasPartIntAllFKs = function () {
            var endpoint = API + "PersonaPartInt/GetAllFKs";
            return $http.get(endpoint);
        };

        // Get PersonaPartIntById
        service.getPersonaPartInt = function (personaPartIntId) {
            var endpoint = API + "PersonaPartInt/Get/" + personaPartIntId;
            return $http.get(endpoint);
        }
        // Get PersonasPartIntFKById
        service.getPersonaPartIntFKById = function (PersonaPartIntId) {
            var endpoint = API + "PersonaPartInt/GetFKById/" + PersonaPartIntId;
            return $http.get(endpoint);
        }

        //Create PersonaPartInt
        service.create = function (personaPartInt) {
            var endpoint = API + "PersonaPartInt/Create/" + personaPartInt;
            return $http.post(endpoint, personaPartInt);
        }

        // Update PersonasPartInt
        service.update = function (personaPartInt) {
            var endpoint = API + "PersonaPartInt/Update";
            return $http.put(endpoint, personaPartInt);
        }

        // Delete PersonaPartInt
        service.delete = function (personaPartIntId) {
            var endpoint = API + "PersonaPartInt/Delete/" + personaPartIntId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "PersonaPartInt/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }
        // Obtiene las Naturalezas de Interaccion by Estado
        service.getNaturalezasInteraccionEstado = function () {
            var endPoint = API + "NaturalezaInteraccion/GetAllByEstado";
            return $http.get(endPoint);
        }

        // Obtiene las Naturalezas de Interaccion without estado
        service.getNaturalezasInteraccion = function () {
            var endPoint = API + "NaturalezaInteraccion/GetAll";
            return $http.get(endPoint);
        }

        return service;
    }

}());