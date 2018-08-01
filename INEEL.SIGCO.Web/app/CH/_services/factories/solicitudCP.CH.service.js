(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("SolicitudesCPService", ["$http", "globalGet", SolicitudesCPService]);

    function SolicitudesCPService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "SolicitudCP/GetAll";
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        return service;
    }
})();