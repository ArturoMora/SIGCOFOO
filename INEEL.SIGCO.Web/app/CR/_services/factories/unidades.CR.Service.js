(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("UnidadesCRService", [
            "$http",
            "globalGet",
            UnidadesCRService
        ]);
    function UnidadesCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Unidad
        service.getUnidadesById = function (empresaId) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/GetById/" + empresaId;
            return $http.get(endpoint);
        };
        // Create Unidad
        service.createUnidad = function (unidadOrganizacional) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/Create/" + unidadOrganizacional;
            return $http.post(endpoint, unidadOrganizacional);
        }
        // Create Unidad
        service.CrearArbolUnidadOrganizacional = function (unidadOrganizacional) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/CrearArbolUnidadOrganizacional/" + unidadOrganizacional;
            return $http.post(endpoint, unidadOrganizacional);
        }
        // Validador Unidad
        service.Validador = function (cveUnidadId) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/Validador/" + cveUnidadId;
            return $http.get(endpoint);
        }
        service.ValidadorClaves = function (cveUnidadId) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/ValidadorClaves";
            return $http.post(endpoint, cveUnidadId);
        }
        // Update Umidad
        service.editarUnidad = function (unidadOrganizacional) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/Update/" + unidadOrganizacional;
            return $http.put(endpoint, unidadOrganizacional);
        }
        // Actualiza el nodo y la descripcion de todos sus nodos hijos
        service.ActualizaArbol = function (unidadOrganizacional) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/ActualizaArbol/" + unidadOrganizacional;
            return $http.put(endpoint, unidadOrganizacional);
        }
        // Delete ContactoPerfil
        service.delete = function (claveUnidad) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/Delete/" + claveUnidad;
            return $http.delete(endpoint);
        }

        service.deleteUnidad = function (claveUnidad) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/DeleteUnidad" ;
            return $http.post(endpoint, claveUnidad);
        }

        return service;
    }
}());