(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("AsociacionesService", ["$http", "globalGet", AsociacionesService]);

    function AsociacionesService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (registro) {
            var endPoint = API + "Asociaciones/GetByClaveEmpleado/" + registro;
            console.log(endPoint);
            return $http.get(endPoint);
        }

        service.getAsociaciones = function () {
            var endPoint = API + "Asociacion/GetAll";
            console.log(endPoint);
            return $http.get(endPoint);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "Asociaciones/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Eliminar
        service.delete = function (Id) {
            debugger;
            var endPoint = API + "Asociaciones/Delete/" + Id;
            return $http.delete(endPoint);
        }

        //By Id
        service.GetById = function (id) {
            var endPoint = API + "Asociaciones/GetById/" + id;
            return $http.get(endPoint);
        }

        //Update
        service.update = function (registro) {
            var endpoint = API + "Asociaciones/Update/" + registro;
            return $http.put(endpoint, registro);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "Asociaciones/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }

        service.updateValidacion = function (registrofa) {
            var endpoint = API + "Asociaciones/UpdateSolicitud/" + registrofa;
            return $http.put(endpoint, registrofa);
        }
        service.updateSolicitud = function (estado) {
            var endpoint = API + "Solicitud/UpdateEstado/" + estado;
            return $http.put(endpoint, estado);
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
            var endPoint = API + "Asociacion/ValidarDuplicados";
            return $http.post(endPoint,obj);
        }

        return service;
    }
})();