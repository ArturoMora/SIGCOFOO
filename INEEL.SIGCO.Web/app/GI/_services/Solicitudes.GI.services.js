(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("solicitudesGIService", ["$http", "globalGet", solicitudesGIService]);

    function solicitudesGIService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "SolicitudGI/Create";
            return $http.post(endPoint, Registro);
        }

        service.getAllPendientesAdministradorGI = function () {
            var endPoint = API + "SolicitudGI/getAllPendientesAdministradorGI";
            return $http.get(endPoint);
        }

        service.getAllAceptadasAdministradorGI = function () {
            var endPoint = API + "SolicitudGI/getAllAceptadasAdministradorGI";
            return $http.get(endPoint);
        }


        service.getAllRechazadasAdministradorGI = function () {
            var endPoint = API + "SolicitudGI/getAllRechazadasAdministradorGI";
            return $http.get(endPoint);
        }

        

        service.getAllPendientesEvaluadoresGI = function (id) {
            var endPoint = API + "SolicitudGI/getAllPendientesEvaluadoresGI/"+id;
            return $http.get(endPoint,id);
        }

        service.getAllSolicitudesAdministradorGI = function (id, clave) {
            var endPoint = API + "SolicitudGI/getAllSolicitudesAdministradorGI/" + id + "/" + clave;
            return $http.get(endPoint, id, clave);
        }

        service.notificar = function (Registro) {
            var endPoint = API + "SolicitudGI/notificar?block=no";
            return $http.post(endPoint, Registro);
        }

        service.updateSolicitud = function (registro) {
            var endpoint = API + "SolicitudGI/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }

        service.getAllPendientesGerentes = function (id) {
            
            var endPoint = API + "SolicitudGI/getAllSolicitudesGerenteGI/" + id ;
            return $http.get(endPoint, id);
        }

        service.getAllAceptadasGerenteGI = function (id) {
            var endPoint = API + "SolicitudGI/getAllAceptadasGerenteGI/"+id;
            return $http.get(endPoint,id);
        }


        service.getAllRechazadasGerenteGI = function (id) {
            var endPoint = API + "SolicitudGI/getAllRechazadasGerenteGI/"+id;
            return $http.get(endPoint,id);
        }

        service.GetAllGerente = function (id, clave) {
            var endPoint = API + "SolicitudGI/GetAllGerente/" + id;
            return $http.get(endPoint, id, clave);
        }

        return service;

    }

})();