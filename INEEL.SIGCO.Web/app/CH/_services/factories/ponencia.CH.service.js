(function () {
    "use strict";
    var app = angular.module("ineel.controllers");

    app.factory("PonenciaService", ["$http", "globalGet", PonenciaService]);

    function PonenciaService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener paises
        service.getPaises = function () {
            var endPoint = API + "Pais/GetAll/";
            return $http.get(endPoint);
        }
        //Obtener pais
        service.getPais = function (id) {
            var endPoint = API + "Pais/GetById/" + id;
            return $http.get(endPoint);
        }
        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "Ponencia/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        //becas internas
        service.getBecaInterna = function (clave) {
            var endPoint = API + "Ponencia/GetAll/" + clave;
            return $http.get(endPoint);
        }

        ////Agregar registro 
        service.add = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Ponencia/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }

        //Eliminar registro SNI
        service.delete = function (id) {
            var endPoint = API + "Ponencia/Delete/" + id;
            return $http.delete(endPoint);
        }
        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "Ponencia/GetById/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var request = $http({
                method: "put",
                url: API + "Ponencia/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        service.getCongresos = function () {
            var endPoint = API + "Congreso/GetAll";
            return $http.get(endPoint);
        }
        service.getAmbitos = function () {
            var endPoint = API + "Ambito/GetAll";
            return $http.get(endPoint);
        }
        service.getNiveles = function () {
            var endPoint = API + "NivelPublicacion/GetAll";
            return $http.get(endPoint);
        }
        service.getEstados = function () {
            var endPoint = API + "EstadoPonencia/GetAll";
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.updateEstado = function (Registro) {
            var endPoint = API + "Ponencia/UpdateEstado/" + Registro;
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

        service.obtenAdminCh = function () {
            var endPoint = API + "RolPersona/GetAdminCH/";
            return $http.get(endPoint);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacionConCoautores?block=no";
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacionConCoautores = function (Registro) {
            var endPoint = API + "Correo/SendNotificacionConCoautores?block=no";
            return $http.post(endPoint, Registro);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        ////AutorIIE
        service.AddUser = function (Registro) {
            var endPoint = API + "AutorIIEPonencia/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.getByPonencia = function (id) {
            var endPoint = API + "AutorIIEPonencia/GetByPonencia/" + id;
            return $http.get(endPoint);
        }

        service.deleteAutorIIE = function (id) {
            var endPoint = API + "AutorIIEPonencia/Delete/" + id;
            return $http.delete(endPoint);
        }
        //AutorPublicacionExt
        service.AddUserExt = function (Registro) {
            var endPoint = API + "AutorPonenciaExt/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.getByPonenciaExt = function (id) {
            var endPoint = API + "AutorPonenciaExt/GetByPonencia/" + id;
            return $http.get(endPoint);
        }

        service.deleteAutorExt = function (id) {
            var endPoint = API + "AutorPonenciaExt/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.ValidarExistencia = function (id) {
            var endPoint = API + "Solicitud/ValidarRechazoAdminPonencia/" + id;
            return $http.get(endPoint);
        }

        service.updateAutoresInt = function (Registro) {
            var endPoint = API + "AutorIIEPonencia/Update";
            return $http.put(endPoint, Registro);
        }

        service.updateAutoresExt = function (Registro) {
            var endPoint = API + "AutorPonenciaExt/Update";
            return $http.put(endPoint, Registro);
        }


        return service;
    }
})();