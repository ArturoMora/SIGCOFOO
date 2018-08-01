
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarEmpresasService", ["$http", "globalGet", empresasService]);

    function empresasService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        
        service.GetEmpresas = function (empresas) {
            var endPoint = API + "Empresas/GetEmpresasModal/";
            return $http.post(endPoint, empresas);
        }

        service.GetEmpresasForModalCompetidores = function () {
            var endPoint = API + "Empresas/GetEmpresasForModalCompetidores/";
            return $http.get(endPoint);
        }

        return service;



    }

}());