(function () {
    "use strict";
    var app = angular.module("ineel.CH.services");

    app.factory("ExperienciaExternaService", ["$http", "globalGet", ExperienciaExternaService]);

    function ExperienciaExternaService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "ExperienciaExterna/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        //becas internas
        service.getBecaInterna = function (clave) {
            var endPoint = API + "ExperienciaExterna/GetAll/" + clave;
            return $http.get(endPoint);
        }
        ////Agregar registro 
        service.add = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "ExperienciaExterna/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }
        //Eliminar registro SNI
        service.delete = function (id) {
            var endPoint = API + "ExperienciaExterna/Delete/" + id;
            return $http.delete(endPoint);
        }
        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "ExperienciaExterna/GetById/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var request = $http({
                method: "put",
                url: API + "ExperienciaExterna/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        ////Actualizar 
        service.updateEstado = function (Registro) {
            var endPoint = API + "ExperienciaExterna/UpdateEstado/" + Registro;
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

        return service;
    }
})();