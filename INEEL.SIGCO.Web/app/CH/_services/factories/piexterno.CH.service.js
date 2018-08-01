(function () {
    "use strict";
    var app = angular.module("ineel.CH.services");

    app.factory("PIExternoService", ["$http", "globalGet", PIExternoService]);

    function PIExternoService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "PropiedadIndustrial/GetByClavePersona/" + clave;
            return $http.get(endPoint);
        }

        //Obtener todos los registros del usuario y tambien aquellos en los que participe como coautor
        service.GetByClaveAutorWithCoAutores = function (clave) {
            var endPoint = API + "PropiedadIndustrial/GetByClaveAutorWithCoAutores/" + clave;
            return $http.get(endPoint);
        }


        //obtener registro  sobre propiedad industrial y tipo de propiedad
        service.getbyidPropiedadIndustrial = function (id) {
            var endPoint = API + "PropiedadIndustrial/GetByIdYTipoPropiedad/" + id;
            return $http.get(endPoint);
        }

        //becas internas
        service.getBecaInterna = function (clave) {
            var endPoint = API + "PIExterno/GetAll/" + clave;
            return $http.get(endPoint);
        }
        ////Agregar registro 
        service.add = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "PIExterno/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }
        //Eliminar registro SNI
        service.delete = function (id) {
            var endPoint = API + "PropiedadIndustrial/Delete/" + id;
            return $http.delete(endPoint);
        }
        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "PIExterno/GetById/" + id;
            return $http.get(endPoint);
        }
        service.getbyidColaboraciones = function (id) {
            var endPoint = API + "RequisicionesPI/GetById/" + id;
            return $http.get(endPoint);
        }
        

        service.update = function (registro) {
            var request = $http({
                method: "put",
                url: API + "PIExterno/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        service.getTiposPI = function () {
            var endPoint = API + "TipoPI/GetAll";
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.updateEstado = function (Registro) {
            var endPoint = API + "PIExterno/UpdateEstado/" + Registro;
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
            var endPoint = API + "AutoresIndustrialInt/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.getByPIExterno = function (id) {
            var endPoint = API + "AutoresIndustrialInt/GetByPIExterno/" + id;
            return $http.get(endPoint);
        }

        service.deleteAutorIIE = function (id) {
            var endPoint = API + "AutoresIndustrialInt/Delete/" + id;
            return $http.delete(endPoint);
        }
        //AutorPublicacionExt
        service.AddUserExt = function (Registro) {
            var endPoint = API + "AutoresIndustrialExt/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        service.getByPIExterno2 = function (id) {
            var endPoint = API + "AutoresIntPIPatrimonio/GetByColaboracionRequisicion/" + id;
            return $http.get(endPoint);
        }
        service.getByPIExternoExt2 = function (id) {
            var endPoint = API + "AutoresExtPIPatrimonio/GetByColaboracionRequisicion/" + id;
            return $http.get(endPoint);
        }

        service.getByPIExternoExt = function (id) {
            var endPoint = API + "AutoresIndustrialExt/GetByPIExterno/" + id;
            return $http.get(endPoint);
        }

        service.deleteAutorExt = function (id) {
            var endPoint = API + "AutoresIndustrialExt/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        return service;
    }
})();