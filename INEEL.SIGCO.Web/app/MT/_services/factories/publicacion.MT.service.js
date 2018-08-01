(function () {
    "use strict";
    var app = angular.module("ineel.MT.services");

    app.factory("PublicacionService", ["$http", "globalGet", PublicacionService]);

        function PublicacionService($http, globalGet) {
            ////Inicializacion de variables
            var API = globalGet.get("api");
            var service = {};

            //Obtener todos los registros del usuario que inicio sesion
            service.getbyclave = function (clave) {
                var endPoint = API + "Publicacion/GetByClave/" + clave;
                return $http.get(endPoint);
            }
            //becas internas
            service.getBecaInterna = function (clave) {
                var endPoint = API + "Publicacion/GetAll/" + clave;
                return $http.get(endPoint);
            }
            ////Agregar registro 
            service.add = function (Registro) {
                var request = $http({
                    method: "post",
                    url: API + "Publicacion/Create/",
                    headers: { 'Content-Type': 'application/json' },
                    data: Registro
                });
                return request;
            }
            //Eliminar registro SNI
            service.delete = function (id) {
                var endPoint = API + "Publicacion/Delete/" + id;
                return $http.delete(endPoint);
            }
            //obtener registro 
            service.getbyid = function (id) {
                var endPoint = API + "Publicacion/GetById/" + id;
                return $http.get(endPoint);
            }

            service.update = function (registro) {
                var request = $http({
                    method: "put",
                    url: API + "Publicacion/Update/",
                    headers: { 'Content-Type': 'application/json' },
                    data: registro
                });
                return request;
            }

            service.getRevistas = function () {
                var endPoint = API + "Revista/GetAll";
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
                var endPoint = API + "EstadoPublicacion/GetAll";
                return $http.get(endPoint);
            }
            ////Actualizar 
            service.updateEstado = function (Registro) {
                var endPoint = API + "Publicacion/UpdateEstado/" + Registro;
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
            service.AddUser= function (Registro) {
                var endPoint = API + "AutorIIEPublicacion/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.getByPublicacion = function (id) {
                var endPoint = API + "AutorIIEPublicacion/GetByPublicacion/" + id;
                return $http.get(endPoint);
            }

            service.deleteAutorIIE = function (id) {
                var endPoint = API + "AutorIIEPublicacion/Delete/" + id;
                return $http.delete(endPoint);
            }
            //AutorPublicacionExt
            service.AddUserExt = function (Registro) {
                var endPoint = API + "AutorPublicacionExt/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.getByPublicacionExt = function (id) {
                var endPoint = API + "AutorPublicacionExt/GetByPublicacion/" + id;
                return $http.get(endPoint);
            }

            service.deleteAutorExt = function (id) {
                var endPoint = API + "AutorPublicacionExt/Delete/" + id;
                return $http.delete(endPoint);
            }

            service.AddBitacoraSolicitud = function (Registro) {
                var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.ValidarExistencia = function (id) {
                var endPoint = API + "Solicitud/ValidarRechazoAdminPublicacion/" + id;
                return $http.get(endPoint);
            }
            return service;
        }
    })();