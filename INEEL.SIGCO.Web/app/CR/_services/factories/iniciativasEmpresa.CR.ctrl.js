(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("IniciativasEmpresaCRService", [
            "$http",
            "globalGet",
            IniciativasEmpresaCRService
        ]);

    function IniciativasEmpresaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Iniciativas
        service.getIniciativasEmpresa = function () {
            var endpoint = API + "Iniciativas/GetIniciativasEmpresa";
            return $http.get(endpoint);
        };
        // Get iniciativa
        service.getIniciativaEmpresa = function (Id) {
            var endpoint = API + "Iniciativas/GetById/" + Id;
            return $http.get(endpoint);
        };
        // Get iniciativa
        service.getIniciativaEmpresaAsignada = function (iniciativaId) {
            var endpoint = API + "Iniciativas/GetAsignado/" + iniciativaId;
            return $http.get(endpoint);
        };
        // Get Iniciativas Asignados
        service.getIniciativasAsignadasEmpresa = function (empresaId) {
            var endpoint = API + "Iniciativas/GetAllIniciativasAsociadas/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Iniciativas asociadas a la unidad organizacional de la empresa
        service.GetIniciativasAsociadasUnidadesEmpresa = function (empresaId) {
            var endpoint = API + "Iniciativas/GetIniciativasAsociadasUnidadesEmpresa/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Iniciativas asociadas a la unidad organizacional de la empresa , soporta los nuevos casos de unidades con nombres como 'CFE1.6.2'
        service.GetIniciativasAsociadasNodoEmpresa = function (nodo) {
            var endpoint = API + "Iniciativas/GetIniciativasAsociadasNodoEmpresa/";
            return $http.post(endpoint, nodo);
        };

        // Asociar iniciativa
        service.updateEmpresa = function (iniciativaEmpresa) {
            var endpoint = API + "Iniciativas/CreateIniciativaEmpresa";
            return $http.put(endpoint, iniciativaEmpresa);
        };
        // Update iniciativa
        service.update = function (iniciativaEmpresa) {
            var endpoint = API + "Iniciativas/UpdateIniciativa";
            return $http.put(endpoint, iniciativaEmpresa);
        }
        // Delete iniciativa
        service.delete = function (iniciativaEmpresa) {
            var endpoint = API + "Iniciativas/Delete";
            return $http.put(endpoint, iniciativaEmpresa);
        }
        return service;
    }
}());