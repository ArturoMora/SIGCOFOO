(function () {
    "use strict";
    var app = angular.module("ineel.CH.services");

    app.factory("softwareservice", ["$http", "globalGet", softwareservice]);

    function softwareservice($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        service.getbyid = function (id) {
            var endPoint = API + "SoftwarePersonal/GetByIdDetails/" + id;
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "softwarePersonal/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.updateSolicitud = function (registro) {
            var endpoint = API + "Solicitud/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }

        return service;
    }
})();