(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("AreasInvestigacionCRService", [
        "$http",
        "globalGet",
        AreasInvestigacionCRService
        ]);

    function AreasInvestigacionCRService($http, globalGet) { 
        var API = globalGet.get("api");
        var service = {};

        // Get AreasInvestigacion
        service.getAreasInvestigacion = function () {
            var endpoint = API + "AreaInvestigacion/GetAll";
            return $http.get(endpoint);
        };

        // Get AreaInvestigacionById
        service.getAreaInvestigacion = function (areaInvestigacionId) {
            var endpoint = API + "AreaInvestigacion/Get/" + areaInvestigacionId;
            return $http.get(endpoint);
        }

        //Create AreaInvestigacion
        service.create = function (areaInvestigacion) {
            var endpoint = API + "AreaInvestigacion/Create/" + areaInvestigacion;
            return $http.post(endpoint, areaInvestigacion);
        }

        // Update AreasInvestigacion
        service.update = function (areaInvestigacion) {
            var endpoint = API + "AreaInvestigacion/Update";
            return $http.put(endpoint, areaInvestigacion);
        }

        // Delete AreaInvestigacion
        service.delete = function (areaInvestigacionId) {
            var endpoint = API + "AreaInvestigacion/Delete/" + areaInvestigacionId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "AreaInvestigacion/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;
    }

}());