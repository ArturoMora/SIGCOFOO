(function () {
    "use strict";
    angular
        .module("ineel.services")
        .factory("correoNotificacionService", ["$http", "globalGet", correoNotificacionService]);

    function correoNotificacionService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacionConCoautores = function (Registro) {
            var endPoint = API + "Correo/SendNotificacionConCoautores?block=no";
            return $http.post(endPoint, Registro);
        }

        return service;

    }

})();