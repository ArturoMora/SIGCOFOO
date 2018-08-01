(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("IdiomasService", ["$http", "globalGet", IdiomasService]);

    function IdiomasService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //get certificaciones
        service.getcetificaciones = function () {
            var endPoint = API + "Certificacion/GetAll";
            return $http.get(endPoint);
        }

        service.getcetificacionesAll = function (id) {
            var endPoint = API + "Certificacion/GetAllCertificacion/"+id;
            return $http.get(endPoint);
        }
        //get idiomas
        service.get = function () {
            var endPoint = API + "idiomas/GetAll";
            return $http.get(endPoint);
        }
        //get idiomas por clave empleado 
        service.getbyclave = function (claveempleado) {
            var endPoint = API + "idiomas/GetByClaveEmpleado/" + claveempleado;
            return $http.get(endPoint);
        }
        //get idiomas por idiomasid 
        service.getbyid = function (idiomasid) {
            var endPoint = API + "idiomas/GetById/" + idiomasid;
            return $http.get(endPoint);
        }
        // create idioma
        service.create = function (idioma) {
            var endpoint = API + "idiomas/Create/";
            return $http.post(endpoint, idioma);
        }

        // update idioma
        service.update = function (idioma) {
            var endpoint = API + "idiomas/Update/";
            return $http.put(endpoint, idioma);
        }

        // Delete Contacto
        service.delete = function (idiomaid) {
            var endpoint = API + "idiomas/Delete/" + idiomaid;
            return $http.delete(endpoint);
        }

        service.updateSolicitud = function (registro) {
            var endpoint = API + "Solicitud/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }

        service.updateValidacion = function (registrofa) {
            var endpoint = API + "idiomas/UpdateSolicitud/" + registrofa;
            return $http.put(endpoint, registrofa);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "idiomas/UpdateEstado/" + Registro;
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
            var endPoint = API + "Idioma/ValidarDuplicados";
            return $http.post(endPoint,obj);
        }

        return service;

    }

})();