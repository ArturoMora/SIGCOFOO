(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("DistincionService", ["$http", "globalGet", DistincionService]);

    function DistincionService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "Distincion/GetByClaveEmpleado/" + clave;
            return $http.get(endPoint);
        }
        //Agregar distincion
        service.distincionadd = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Distincion/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }
        //Eliminar registro SNI
        service.distinciondelete = function (id) {
            var endPoint = API + "Distincion/Delete/" + id;
            return $http.delete(endPoint);
        }

        //Buscar Distincion
        service.getbyid= function(id) {
            var endPoint = API + "Distincion/getById/" + id;
            return $http.get(endPoint);
        }
        //Editar Distincion
        service.distincionedit = function (registro) {
            var request = $http({
                method: "put",
                url: API + "Distincion/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        service.updateSolicitud = function (registro) {
            var endpoint = API + "Solicitud/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }

        service.updateValidacion = function (registro) {
            var endpoint = API + "Distincion/UpdateSolicitud/" + registro;
            return $http.put(endpoint, registro);
        }


        service.updateEstado = function (Registro) {
            var endPoint = API + "Distincion/UpdateEstado/" + Registro;
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
        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.ValidaRegistroDuplicado = function (obj) {
            var endPoint = API + "Distincion/ValidarDuplicados";
            return $http.post(endPoint,obj);
        }

        return service;
    }
})();