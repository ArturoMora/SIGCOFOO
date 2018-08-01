
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarClientesGENService", ["$http", "globalGet", empresasService]);

    function empresasService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GetClientesWithUnidadesForModal = function () {
            var endPoint = API + "Clientes/GetClientesWithUnidadesForModal";
            return $http.get(endPoint);
        }

        return service;



    }

}());