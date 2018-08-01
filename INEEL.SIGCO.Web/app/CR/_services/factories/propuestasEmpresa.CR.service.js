(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("PropuestasEmpresaCRService", [
            "$http",
            "globalGet",
            PropuestasEmpresaCRService
        ]);

    function PropuestasEmpresaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Propuestas
        service.getPropuestasEmpresa = function () {
            var endpoint = API + "Propuestas/GetPropuestasEmpresa";
            return $http.get(endpoint);
        };
        // Get propuesta
        service.getPropuestaEmpresa = function (propuestaId) {
            var endpoint = API + "Propuestas/GetById/" + propuestaId;
            return $http.get(endpoint);
        };
        // Get propuesta
        service.getPropuestaEmpresaAsignada = function (propuestaId) {
            var endpoint = API + "Propuestas/GetAsignado/" + propuestaId+"/";
            return $http.get(endpoint);
        };

        // Get propuesta, soporta los nuevos casos de propuestas como GCEyC._0004_2017_01 (con punto)
        service.getPropuestaEmpresaNodoAsignada = function (propuesta) {
            var endpoint = API + "Propuestas/GetPropuestaAsignadas/";
            return $http.post(endpoint, propuesta);
        };
        // Get Propuestas Asignados
        service.getPropuestasAsignadasEmpresa = function (empresaId) {
            var endpoint = API + "Propuestas/GetAllPropuestasAsociadas/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Propuestas Asignados
        service.GetPropuestasAsociadosUnidadesEmpresa = function (empresaId) {
            var endpoint = API + "Propuestas/GetPropuestasAsociadosUnidadesEmpresa/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Propuestas Asignados
        service.GetPropuestasAsociadosNodoEmpresa = function (nodo) {
            var endpoint = API + "Propuestas/GetPropuestasAsociadosNodoEmpresa/";
            return $http.post(endpoint, nodo);
        };

        // Asociar propuesta
        service.updateEmpresa = function (propuestaEmpresa) {
            var endpoint = API + "Propuestas/CreatePropuestaEmpresa";
            return $http.put(endpoint, propuestaEmpresa);
        };
        // Update propuesta
        service.update = function (propuestaEmpresa) {
            var endpoint = API + "Propuestas/UpdatePropuesta";
            return $http.put(endpoint, propuestaEmpresa);
        }
        // Delete propuesta
        service.delete = function (propuestaEmpresa) {
            var endpoint = API + "Propuestas/Delete";
            return $http.put(endpoint, propuestaEmpresa);
        }
        return service;
    }
}());