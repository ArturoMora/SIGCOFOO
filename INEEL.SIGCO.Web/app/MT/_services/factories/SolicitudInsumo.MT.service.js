(function () {
    "use strict";
    angular
        .module("ineel.MT.services")
        .factory("SolicitudInsumoService", ["$http", "globalGet",SolicitudInsumoService]);

    function SolicitudInsumoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "SolicitudInsumo/GetAll";
            return $http.get(endPoint);
        }
        //Se lee los que corresponden al empleado logeado
        service.getById = function (clave) {
            var endPoint = API + "SolicitudInsumo/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        //Se lee el nombre del empleado que solicito 
        service.getByClave = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        return service;
    }
})();