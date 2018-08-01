(function () {
    "use strict";
    var app = angular.module("ineel.CH.services");

    app.factory("DAExternoService", ["$http", "globalGet", DAExternoService]);

    function DAExternoService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "DAExterno/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        service.getByDAIntPatrimonioColaboracion = function (clave) {
            var endPoint = API + "SolicitudParticiantesDA/GetByDAColaboracion/" + clave;
            return $http.get(endPoint);
        }
        //becas internas
        service.getBecaInterna = function (clave) {
            var endPoint = API + "DAExterno/GetAll/" + clave;
            return $http.get(endPoint);
        }
        ////Agregar registro 
        service.add = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "DAExterno/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }
        //Eliminar registro SNI
        service.delete = function (id) {
            var endPoint = API + "DAExterno/Delete/" + id;
            return $http.delete(endPoint);
        }
        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "DAExterno/GetById/" + id;
            return $http.get(endPoint);
        }

        service.getbyidPatrimonial = function (id) {
            var endPoint = API + "SolicitudesDA/GetByDAPatrimonial/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var request = $http({
                method: "put",
                url: API + "DAExterno/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        service.getRamas = function () {
            var endPoint = API + "RamaDA/GetAll";
            return $http.get(endPoint);
        }

        ////Actualizar 
        service.updateEstado = function (Registro) {
            var endPoint = API + "DAExterno/UpdateEstado/" + Registro;
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
        ////AutorIIE
        service.AddUser = function (Registro) {
            var endPoint = API + "AutoresIntDA/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.getByDAExterno = function (id) {
            var endPoint = API + "AutoresIntDA/GetByDAExterno/" + id;
            return $http.get(endPoint);
        }

        service.deleteAutorIIE = function (id) {
            var endPoint = API + "AutoresIntDA/Delete/" + id;
            return $http.delete(endPoint);
        }
        //AutorPublicacionExt
        service.AddUserExt = function (Registro) {
            var endPoint = API + "AutoresExtDA/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.getByDAExternoExt = function (id) {
            var endPoint = API + "AutoresExtDA/GetByDAExterno/" + id;
            return $http.get(endPoint);
        }

        service.deleteAutorExt = function (id) {
            var endPoint = API + "AutoresExtDA/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        return service;
    }
})();