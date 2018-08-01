(function () {
    "use strict";
    var app = angular.module("ineel.CH.services");

    app.factory("SNIService", ["$http", "globalGet", SNIService]);

    function SNIService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "SNI/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        //Obtener todos los niveles de sni
        service.getnivelSNI = function () {
            var endPoint = API + "NivelSNI/GetAll";
            return $http.get(endPoint);
        }
        //Obtener todas la areas de sni
        service.getareaSNI = function () {
            var endPoint = API + "AreaSNI/GetAll";
            return $http.get(endPoint);
        }
        //Agregar registro SNI
        service.addSNI = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "SNI/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }
        //Eliminar registro SNI
        service.deleteSNI = function (id) {
            var endPoint = API + "SNI/Delete/" + id;
            return $http.delete(endPoint);
        }
        //obtener registro sni
        service.getsnibyid = function (id) {
            var endPoint = API + "SNI/GetById/" + id;
            return $http.get(endPoint);
        }

        service.updatesni = function (registro) {
            var request = $http({
                method: "put",
                url: API + "SNI/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        ////Actualizar 
        service.updateEstado = function (Registro) {
            var endPoint = API + "SNI/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.updateSolicitud = function (registro) {
            var endpoint = API + "Solicitud/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }

        service.updateValidacion = function (registrofa) {
            var endpoint = API + "SNI/UpdateSolicitud/" + registrofa;
            return $http.put(endpoint, registrofa);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }
        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.ValidaRegistroDuplicado = function (obj) {
            var endPoint = API + "SNI/ValidarDuplicados";
            return $http.post(endPoint,obj);
        }

        return service;
    }
})();