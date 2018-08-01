(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ListasAlianzaCRService", [
        "$http",
        "globalGet",
        ListasAlianzaCRService
        ]);

    function ListasAlianzaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Tipos de Convenio
        service.getTiposConvenio= function () {
            var endpoint = API + "TipoConvenio/getAll";
            return $http.get(endpoint);
        };

        // Get Ambitos
        service.getAmbitos = function (fuenteId) {
            var endpoint = API + "AmbitoConv/GetAll";
            return $http.get(endpoint);
        };

        // Get Tipos de Organización
        service.getTiposOrganizacion = function () {
            var endpoint = API + "TipoOrganizacion/GetAll";
            return $http.get(endpoint);
        };

        // Get Proyectos por convocatoria
        service.getListaAliados = function (parametros) {
            //debugger;
            var endpoint = API + "ListaAlianza/GetAlianzasByConv";
            return $http.post(endpoint, parametros);
        };

        // Get Proyectos por convocatoria
        service.getResListaAliados = function (parametros) {
            //debugger;
            var endpoint = API + "ListaAlianza/GetResAlianzasByConv";
            return $http.post(endpoint, parametros);
        };

        // Get Proyectos por convocatoria PDF
        service.getResListaAliadosPDF = function (parametros) {
            //debugger;
            var endpoint = API + "ListaAlianza/GetResAlianzasPDF";
            return $http.post(endpoint, parametros);
        };

       return service;
    }
}());
