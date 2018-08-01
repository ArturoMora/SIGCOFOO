(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("SolicitudesService", ["$http", "globalGet", SolicitudesService]);

    function SolicitudesService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Solicitud/GetAll";
            return $http.get(endPoint);
        }

        /***Solicitudes pendientes de admin CH*/
        service.GetPendientesAdministradorCH = function () {
            var endPoint = API + "Solicitud/GetPendientesAdministradorCH";
            return $http.get(endPoint);
        }

        /***Solicitudes pendientes admin sindicalizados */
        service.GetPendientesAdministradorSindicalizados = function () {
            var endPoint = API + "Solicitud/GetPendientesAdministradorSindicalizados";
            return $http.get(endPoint);
        }
        service.getAllGerente = function () {
            var endPoint = API + "Solicitud/GetAllGerente";
            return $http.get(endPoint);
        }

        service.getAllGerentebyClaveunidad = function (id) {
            var endPoint = API + "Solicitud/getAllGerentebyClaveunidad/" + id;
            return $http.get(endPoint);
        }
        service.GetGerente = function () {
            var endPoint = API + "Solicitud/GetGerente";
            return $http.get(endPoint);
        }

        service.GetGerenteByClaveUnidad = function (id) {
            var endPoint = API + "Solicitud/GetGerenteByClaveUnidad/" + id;
            return $http.get(endPoint);
        }


        service.GetAllCursosCP = function () {
            var endPoint = API + "Solicitud/GetAllCursosCP";
            return $http.get(endPoint);
        }
        service.getAllAceptadas = function (id, claveUnidad) {
            var endPoint = API + "Solicitud/GetAllAceptadas/" + id + "/" + claveUnidad;
            return $http.get(endPoint);
        }
        service.getAllRechazadas = function (id, claveUnidad) {
            var endPoint = API + "Solicitud/GetAllRechazadas/" + id + "/" + claveUnidad;
            return $http.get(endPoint);
        }
        service.getAllTodas = function (id, claveUnidad) {
            var endPoint = API + "Solicitud/GetAllTodas/" + id + "/" + claveUnidad;
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        return service;
    }
})();