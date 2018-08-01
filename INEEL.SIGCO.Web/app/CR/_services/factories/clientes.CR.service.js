(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ClientesCRService", [
            "$http",
            "globalGet",
            ClientesCRService
        ]);

    function ClientesCRService($http, globalGet) { //servicios personales llamas a los metodos del WEBApi
        var API = globalGet.get("api");
        var service = {};

        // Get Clientes
        service.getEmpresas = function () {
            var endpoint = API + "Clientes/Get";
            return $http.get(endpoint);
        };

        service.getproyectosvigentes = function () {
            var endpoint = API + "Clientes/GetProyectosVigentes";
            return $http.get(endpoint);
        };

        service.getProyectosTotales = function () {
            var endpoint = API + "Clientes/GetTotalProyectos";
            return $http.get(endpoint);
        }

        service.getaniosdepropuestas = function () {
            var endpoint = API + "Clientes/GetAniosdePropuestas";
            return $http.get(endpoint);
        };
        service.getaniosdeiniciativas = function () {
            var endpoint = API + "Clientes/GetAniosdeIniciativas";
            return $http.get(endpoint);
        };
        service.getaniosdeon = function () {
            var endpoint = API + "Clientes/GetAniosdeOpotunidadesNegocio";
            return $http.get(endpoint);
        };

        service.getpropuestas = function (anio) {
            var endpoint = API + "Clientes/GetPropuestas/" + anio;
            return $http.get(endpoint);
        };

        service.GetEmpresasRelacionadas = function () {
            var endpoint = API + "Clientes/GetEmpresasRelacionadas";
            return $http.get(endpoint);
        };

        service.GetConsultaParametrizadaClientes = function (obj) {
            var endpoint = API + "Clientes/GetConsultaParametrizadaClientes/" + obj;
            return $http.post(endpoint, obj);
        };

        service.getiniciativas = function (anio) {
            var endpoint = API + "Clientes/GetIniciativas/" + anio;
            return $http.get(endpoint);
        };

        service.getoportunidades = function (anio) {
            var endpoint = API + "Clientes/GetOportunidadesNegocio/" + anio;
            return $http.get(endpoint);
        };

        service.getprospectosiniciativas = function () {
            var endpoint = API + "Clientes/GetProspectosIniciativas";
            return $http.get(endpoint);
        };

        service.getprospectoson = function () {
            var endpoint = API + "Clientes/GetProspectosON";
            return $http.get(endpoint);
        };

        service.getclientesactuales = function () {
            var endpoint = API + "Clientes/GetClientesActuales";
            return $http.get(endpoint);
        };

        service.GetProyectosClientesVigentes = function () {
            var endpoint = API + "Clientes/GetProyectosClientesVigentes";
            return $http.get(endpoint);
        };

        service.GetProyectosClientesHistoricos = function () {
            var endpoint = API + "Clientes/GetProyectosClientesHistoricos";
            return $http.get(endpoint);
        };

        service.CountProyectosClientesVigentes = function () {
            var endpoint = API + "Clientes/CountProyectosClientesVigentes";
            return $http.get(endpoint);
        };

        service.CountProyectosClientesHistoricos = function () {
            var endpoint = API + "Clientes/CountProyectosClientesHistoricos";
            return $http.get(endpoint);
        };

        service.getactualespotenciales = function () {
            var endpoint = API + "Clientes/GetActualesPotenciales";
            return $http.get(endpoint);
        };

        service.getinfoactuales = function () {
            var endpoint = API + "Clientes/GetPropuestasONIniciativas";
            return $http.get(endpoint);
        };

        service.getinfopotenciales = function () {
            var endpoint = API + "Clientes/GetPOIPotenciales";
            return $http.get(endpoint);
        };

        return service;
    }
}());