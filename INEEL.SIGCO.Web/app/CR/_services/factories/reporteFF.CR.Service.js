(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ReportesFFCRService", [
        "$http",
        "globalGet",
        ReportesFFCRService
        ]);

    function ReportesFFCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Convocatorias Por Fondo
        service.getByFondo = function (fondoId) {
            var endpoint = API + "Convocatoria/GetAllByFondo/" + fondoId;
            return $http.get(endpoint);
        };

        // Get Fondos por fuente
        service.getFondosAllFKsByfuente = function (fuenteId) {
            var endpoint = API + "FondosPrograma/GetAllByFuente/" + fuenteId;
            return $http.get(endpoint);
        };

        // Get FuenteFinanciamiento by tipo
        service.getFuenteByTipo = function (tipoFuenteId) {
            var endpoint = API + "FuenteFinanciamiento/GetAllByTipo/" + tipoFuenteId;
            return $http.get(endpoint);
        };

        // Get FuentesFinanciamientoWithAllFks
        service.getFuentesFinanciamiento = function () {
            var endpoint = API + "FuenteFinanciamiento/GetAllFKs/";
            return $http.get(endpoint);
        };

        // Get FooEntities
        service.getTipoFuentes = function () {
            var endpoint = API + "TipoFuenteFinanciamiento/getAll";
            return $http.get(endpoint);
        };

        // Get Proyectos por convocatoria
        service.getProyectosByFF = function (parametros) {
            var endpoint = API + "ProyectosFF/GetProyectosByFF";
            return $http.post(endpoint, parametros);
        };

        // Get Proyectos por convocatoria
        service.getPropuestasByFF = function (parametros) {
            var endpoint = API + "PropuestasFF/GetPropuestasByFF";
            return $http.post(endpoint, parametros);
        };

        return service;
    }
}());
