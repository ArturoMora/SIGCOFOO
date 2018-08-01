(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TiposOrganizacionCRService", [
        "$http",
        "globalGet",
        TiposOrganizacionCRService
        ]);

    function TiposOrganizacionCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        

        // GetTiposOrganizacion
        service.getTiposOrganizacion = function () {
            var endpoint = API + "TipoOrganizacion/GetAll";
            return $http.get(endpoint);
        };

        // GetTiposOrganizacionByTrue
        service.getTiposOrganizacionByTrue = function () {
            var endpoint = API + "TipoOrganizacion/GetAllByTrue";
            return $http.get(endpoint);
        };


        // Get TipoOrganizacionById
        service.getTipoOrganizacion = function (tipoOrganizacionId) {
            var endpoint = API + "TipoOrganizacion/Get/" + tipoOrganizacionId;
            return $http.get(endpoint);
        }

        //Create TipoOrganizacion
        service.create = function (tipoOrganizacion) {
            var endpoint = API + "TipoOrganizacion/Create/" + tipoOrganizacion;
            return $http.post(endpoint, tipoOrganizacion);
        }

        // Update TipoOrganizacion
        service.update = function (tipoOrganizacion) {
            var endpoint = API + "TipoOrganizacion/Update";
            return $http.put(endpoint, tipoOrganizacion);
        }

        // Delete TipoOrganizacion
        service.delete = function (tipoOrganizacionId) {
            var endpoint = API + "TipoOrganizacion/Delete/" + tipoOrganizacionId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TipoOrganizacion/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;
    }

}());