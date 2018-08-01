
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarServiciosService", ["$http", "globalGet", serviciosService]);

    function serviciosService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GetServicios = function (servicios) {
            var endPoint = API + "Servicio/GetServiciosModal/";
            return $http.post(endPoint, servicios);
        }
        service.GetServiciosModalCompetidores = function () {
            var endPoint = API + "Servicio/GetServiciosModalCompetidores/";
            return $http.get(endPoint);
        }
        return service;



    }

}());