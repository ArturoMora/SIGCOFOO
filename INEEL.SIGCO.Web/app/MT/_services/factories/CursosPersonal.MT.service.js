(function () {
    "use strict";
    var app = angular.module("ineel.MT.services");

    app.factory("CursosPersonalServiceMT", ["$http", "globalGet", CursosPersonalServiceMT]);
            function CursosPersonalServiceMT($http, globalGet) {
            ////Inicializacion de variables
            var API = globalGet.get("api");
            var service = {};

            //Obtener todos los registros del usuario que inicio sesion
            service.getbyclave = function (clave) {
                var endPoint = API + "CursoInterno/GetByClave/" + clave;
                return $http.get(endPoint);
            }
            //becas internas
            service.getBecaInterna = function (clave) {
                var endPoint = API + "CursoInterno/GetAll/" + clave;
                return $http.get(endPoint);
            }
            ////Agregar registro 
            service.add = function (Registro) {
                var request = $http({
                    method: "post",
                    url: API + "CursoInterno/Create/",
                    headers: { 'Content-Type': 'application/json' },
                    data: Registro
                });
                return request;
            }
            service.getExt = function (id) {
                var endPoint = API + "AutorInternoCursoInterno/GetExtById/" + id;
                return $http.get(endPoint);
            }
            service.AddUserExt = function (Registro) {
                var endPoint = API + "AutorInternoCursoInterno/CreateExt/" + Registro;
                return $http.post(endPoint, Registro);
            }
            service.deleteAutorExt = function (id) {
                var endPoint = API + "AutorInternoCursoInterno/DeleteExt/" + id;
                return $http.delete(endPoint);
            }
            //Eliminar registro SNI
            service.delete = function (id) {
                var endPoint = API + "CursoInterno/Delete/" + id;
                return $http.delete(endPoint);
            }
            //obtener registro 
            service.getbyid = function (id) {
                var endPoint = API + "CursoInterno/GetById/" + id;
                return $http.get(endPoint);
            }

            service.getAdjuntos = function (id) {
                var endPoint = API + "AdjuntoCursos/GetByIdOK/" + id;
                return $http.get(endPoint);
            }
            service.deleteAdjunto = function (id) {
                var endPoint = API + "AdjuntoCursos/Delete/" + id;
                return $http.delete(endPoint);
            }

            service.AddFile = function (Registro) {
                var request = $http({
                    method: "post",
                    url: API + "AdjuntoCursos/Create/",
                    headers: { 'Content-Type': 'application/json' },
                    data: Registro
                });
                return request;
            }
            service.GetUO = function (clave) {
                var endPoint = API + "UnidadOrganizacional/GetById/" + clave;
                return $http.get(endPoint);
            }

            service.AddSitios = function (Registro) {
                var request = $http({
                    method: "post",
                    url: API + "SitiosCursos/Create/",
                    headers: { 'Content-Type': 'application/json' },
                    data: Registro
                });
                return request;
            }

            service.update = function (registro) {
                var request = $http({
                    method: "put",
                    url: API + "CursoInterno/Update/",
                    headers: { 'Content-Type': 'application/json' },
                    data: registro
                });
                return request;
            }

            service.getTipoCurso = function () {
                var endPoint = API + "TipoCurso/GetAll";
                return $http.get(endPoint);
            }
            ////Actualizar 
            service.updateEstado = function (Registro) {
                var endPoint = API + "CursoInterno/UpdateEstado/" + Registro;
                return $http.put(endPoint, Registro);
            }

            service.AddSolicitud = function (Registro) {
                var endPoint = API + "SolicitudCP/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.AddSolicitudCH = function (Registro) {
                var endPoint = API + "Solicitud/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.updateSolicitud = function (registro) {
                var endpoint = API + "SolicitudCP/UpdateEstado/" + registro;
                return $http.put(endpoint, registro);
            }
            service.updateSolicitudCH = function (registro) {
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
                var endPoint = API + "AutorInternoCursoInterno/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.getByObj = function (id) {
                var endPoint = API + "AutorInternoCursoInterno/GetByObj/" + id;
                return $http.get(endPoint);
            }

            service.deleteAutorIIE = function (id) {
                var endPoint = API + "AutorInternoCursoInterno/Delete/" + id;
                return $http.delete(endPoint);
            }        

            service.AddBitacoraSolicitud = function (Registro) {
                var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
                return $http.post(endPoint, Registro);
            }

            service.deleteSitio = function (Id) {
                var endPoint = API + "SitiosCursos/Delete/" + Id;
                return $http.delete(endPoint);
            }

            return service;
        }
    })();