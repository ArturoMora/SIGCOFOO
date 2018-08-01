
(function () {
    "use strict";

    angular
        .module("ineel.MT.services")
        .factory("buscarInformesBecariosService", ["$http", "globalGet", buscarInformesBecariosService]);

    function buscarInformesBecariosService($http, globalGet) {

        var API = globalGet.get("api");
        var service = {};


        // Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "BecarioDirigido/GetById/" + clave;
            return $http.get(endPoint);
        }
        service.getTipoBecas = function () {
            var endPoint = API + "TipoBeca/GetAll";
            return $http.get(endPoint);
        }

        //Tipos de becas internas
        service.getTiposBecasInternas = function () {
            var endPoint = API + "BecaInterna/GetAll";
            return $http.get(endPoint);
        }

        //obtiene el registro de un becario
        service.getBecario = function (id) {
            var endPoint = API + "BecarioExternoINEEL/GetById/" + id;
            return $http.get(endPoint);
        }

        //obtener registro 
        service.getBecarioInternoById = function (id) {
            var endPoint = API + "BecarioInterno/GetById/" + id;
            return $http.get(endPoint);
        }
        
        service.getInstituciones = function () {
            var endPoint = API + "Institucion/GetAll";
            return $http.get(endPoint);
        }

        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "BecarioExterno/GetById/" + id;
            return $http.get(endPoint);
        }

        //obtener registro 
        service.getbyidDirigido = function (id) {
            var endPoint = API + "BecarioDirigido/GetById/" + id;
            return $http.get(endPoint);
        }
        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.getByObj = function (id) {
            var endPoint = API + "AutorInternoCursoInterno/GetByObj/" + id;
            return $http.get(endPoint);
        }

        service.getAdjuntos = function (id) {
            var endPoint = API + "AdjuntoCursos/GetByIdOK/" + id;
            return $http.get(endPoint);
        }

        //Lee ese insumo de la tabla de solicitudes
        service.GetPermiso = function (Registro) {
            var endPoint = API + "Solicitud/GetPermiso/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Da acceso al Jefe
        service.AutJefe = function (Registro) {
            var endpoint = API + "Jerarquia/isJefeHiperonimoDeProyecto/" + Registro;
            return $http.post(endpoint, Registro);
        }

        //Lee por nombre de jefe
        service.GetResponsableByUnOr = function (UnOr) {
            var endpoint = API + "Personas/GetResponsableByClaveUnidadWithoutStatus/" + UnOr;
            return $http.get(endpoint);
        }

        //Lee por nombre de jefe
        service.GetByRol = function (id) {
            var endpoint = API + "RolPersona/GetByRolForsolicitud/" + id;
            return $http.get(endpoint);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/UpdateCreate/" + Registro;
            return $http.post(endPoint, Registro);
        }


        service.AddBitacora = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Para el becario interno
        service.getBecaInterna = function (clave) {
            var endPoint = API + "BecaInterna/GetAll/" + clave;
            return $http.get(endPoint);
        }

        //obtener registro 
        service.getbyidInterna = function (id) {
            var endPoint = API + "BecarioInterno/GetById/" + id;
            return $http.get(endPoint);
        }

        ////Buscar Becario Dirigido
        service.GetExistente = function (Registro) {
            var endpoint = API + "BecarioDirigido/GetExistente/" + Registro;
            return $http.post(endpoint, Registro);
        }

        return service;


    }

}());