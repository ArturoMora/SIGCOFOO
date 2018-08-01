(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ExpertosCRService", [
            "$http",
            "globalGet",
            "$q",
            ExpertosCRService
        ]);

    function ExpertosCRService($http, globalGet, $q) { //servicios personales llamas a los metodos del WEBApi
        var API = globalGet.get("api");
        var service = {};

        // Get Expertos
        service.getexpertos = function () {
            var endpoint = API + "Expertos/GetAll";
            return $http.get(endpoint);
        };
        // Get Experto
        service.getexperto = function (expertoid) {
            var endpoint = API + "Expertos/GetById/" + expertoid;
            return $http.get(endpoint);
        }
        // Get Experto by contactoid
        service.validaexperto = function (contactoid) {
            var endpoint = API + "Expertos/GetByContactoId/" + contactoid;
            return $http.get(endpoint);
        }

        // Paises relacionados con expertos
        service.GetPaisesRelacionExpertos = function () {
            var endpoint = API + "Expertos/GetPaisesRelacionExpertos";
            return $http.get(endpoint);
        }

        // Empresas relacionadas con expertos
        service.GetEmpresasRelacionExpertos = function () {
            var endpoint = API + "Expertos/GetEmpresasRelacionExpertos";
            return $http.get(endpoint);
        }

        // Comunidades relacionadas con expertos
        service.GetComunidadesRelacionExpertos = function () {
            var endpoint = API + "Expertos/GetComunidadesRelacionExpertos";
            return $http.get(endpoint);
        }

        // Lineas de desarrollo tecnologico relacionadas con expertos
        service.GetLineasRelacionExpertos = function () {
            var endpoint = API + "Expertos/GetLineasRelacionExpertos";
            return $http.get(endpoint);
        }

        // Consulta parametrizada de expertos
        service.GetConsultaParametrizadaExpertos = function (experto) {
            var endpoint = API + "Expertos/GetConsultaParametrizadaExpertos/" + experto;
            return $http.post(endpoint, experto);
        }
        // Create experto
        service.crearexperto = function (experto) {
            var endpoint = API + "Expertos/Create/" + experto;
            return $http.post(endpoint, experto);
        }
        // Update experto
        service.update = function (experto) {
            var endpoint = API + "Expertos/Update";
            return $http.put(endpoint, experto);
        }
        // Delete experto
        service.delete = function (expertoid) {
            var endpoint = API + "Expertos/Delete/" + expertoid;
            return $http.delete(endpoint);
        }

        // Get Comunidades
        service.getComunidades = function () {
            var endpoint = API + "Comunidades/GetAllToExpertos";
            return $http.get(endpoint);
        };

        return service;
    }
}());
