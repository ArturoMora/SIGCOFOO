(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("HistorialUnidadesCRService", [
            "$http",
            "globalGet",
            HistorialUnidadesCRService
        ]);
    function HistorialUnidadesCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Create historial movimientos unidad
        service.CreateHistorial = function (unidadOrganizacional) {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/Create";
            return $http.post(endpoint, unidadOrganizacional);
        }

        // Obtiene todo el historial de las unidades organizacionales
        service.GetAll = function () {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/GetAll";
            return $http.get(endpoint);
        };

        // Get historial unidades by empresa
        service.GetAllByEmpresa = function (empresaId) {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/GetAllByEmpresa/" + empresaId;
            return $http.get(endpoint);
        };

        // Get historial unidades by unidad organizacional
        service.GetAllByUnidad = function (empresaId) {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/GetAllByUnidad/" + empresaId;
            return $http.get(endpoint);
        };

        // Get historial unidades by unidad organizacional
        service.GetById = function (empresaId) {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/GetById/" + empresaId;
            return $http.get(endpoint);
        };

        // Get historial unidades by unidad organizacional
        service.Update = function (model) {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/Update";
            return $http.put(endpoint, model);
        };

        // Delete historial
        service.Delete = function (claveUnidad) {
            var endpoint = API + "HistorialUnidadesOrganizacionalesEmpresas/Delete/" + claveUnidad;
            return $http.delete(endpoint);
        }

        return service;
    }
}());