(function () {
    "use strict";

    angular
        .module("ineel.GEN.services")
        .factory("DerechosAutorService", [
            "$http",
            "globalGet",
            DerechosAutorService
        ]);

    function DerechosAutorService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        // crear DA
        service.createda = function (da) {
            var endpoint = API + "DerechosAutor/Create";
            return $http.post(endpoint, da);
        };

        // crear DA
        service.createdach = function (da) {
            var endpoint = API + "DerechosAutor/CreateCH";
            return $http.post(endpoint, da);
        };

        // crear DA
        service.updateda = function (da) {
            var endpoint = API + "DerechosAutor/Update";
            return $http.put(endpoint, da);
        };

        // Obetner DAs 
        service.getDAI = function () {
            var endpoint = API + "DerechosAutor/GetAllInstituto";
            return $http.get(endpoint);
        };

        // Obtener DAs 
        service.GetAllPropiedadInstitutoReporte = function (obj) {
            var endpoint = API + "DerechosAutor/GetAllPropiedadInstitutoReporte/"+obj;
            return $http.post(endpoint,obj);
        };

        // Obetner DA by Id
        service.getdabyid = function (id) {
            var endpoint = API + "DerechosAutor/GetById/" + id;
            return $http.get(endpoint);
        };

        //getderechosautorbyclave
        service.getderechosautorbyclave = function (clave) {
            var endpoint = API + "DerechosAutor/GetByClavePersona/" + clave;
            return $http.get(endpoint);
        }

        //getderechosautorbyclave
        service.GetByClaveAutorWithCoAutores = function (clave) {
            var endpoint = API + "DerechosAutor/GetByClaveAutorWithCoAutores/" + clave;
            return $http.get(endpoint);
        }


        //getderechosautorbyclave
        service.getDerechosAutorPorClavePersona = function (clave) {
            var endpoint = API + "DerechosAutor/GetPorClavePersona/" + clave;
            return $http.get(endpoint);
        }

        //get datos grafica
        service.getdatosgrafica = function () {
            var endpoint = API + "DerechosAutor/GetDerechosAutorAnio/";
            return $http.get(endpoint);
        }

        //eliminar DA 
        service.deleteda = function (clave) {
            var endpoint = API + "DerechosAutor/Delete/" + clave;
            return $http.delete(endpoint);
        }

        //
        service.persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
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
            var endPoint = API + "Correo/SendNotificacion/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Envia correo a los coautores del registro
        service.mailNotificacionConCoautores = function (Registro) {
            var endPoint = API + "Correo/SendNotificacionConCoautores?block=no";
            return $http.post(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //DERECHOS DE AUTOR POR A�O 
        service.derechosAutorAnio = function () {
            var endPoint = API + "DerechosAutor/GetDerechosAutorAnio";
            return $http.get(endPoint);
        }

        return service;
    }

}());