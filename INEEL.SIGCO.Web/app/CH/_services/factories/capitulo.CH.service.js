(function () {
    "use strict";
    var app = angular.module("ineel.services");

    app.factory("CapituloService", ["$http", "globalGet", CapituloService]);

    function CapituloService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //Obtener paises
        service.getPaises = function () {
            var endPoint = API + "Pais/GetAll/";
            return $http.get(endPoint);
        }

        ////Agregar registro 
        service.add = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Capitulos/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }

        ////AutorIIE
        service.AddUser = function (Registro) {
            var endPoint = API + "AutorInternoCapitulo/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //AutorCapitulosExt
        service.AddUserExt = function (Registro) {
            var endPoint = API + "AutorExternoCapitulo/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //AutorCapitulosExt
        service.AddEditor = function (Registro) {
            var endPoint = API + "EditorCapitulo/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "Capitulos/GetById/" + id;
            return $http.get(endPoint);
        }
        ////AutorIIE
        service.AddUserAll = function (Registro) {
            var endPoint = API + "AutorInternoCapitulo/CreateAll/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Obtener paises
        service.getPais = function (id) {
            var endPoint = API + "Pais/GetById/" + id;
            return $http.get(endPoint);
        }
        //AutorCapitulosExt
        service.AddUserExtAll = function (Registro) {
            var endPoint = API + "AutorExternoCapitulo/CreateAll/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //AutorCapitulosExt
        service.AddEditorAll = function (Registro) {
            var endPoint = API + "EditorCapitulo/CreateAll/" + Registro;
            return $http.post(endPoint, Registro);
        }
        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclaveAutor = function (clave) {
            var endPoint = API + "Capitulos/GetByClaveAutor/" + clave;
            return $http.get(endPoint);
        }

        service.GetByClaveAutorWithCoAutores = function (clave) {
            var endPoint = API + "Capitulos/GetByClaveAutorWithCoAutores/" + clave;
            return $http.get(endPoint);
        }

        service.delete = function (registro) {
            var endPoint = API + "Capitulos/Delete/" + registro;
            return $http.delete(endPoint);
        }
        service.PersonaSolicitud = function (clave) {
            var endPoint = API + "Solicitud/GetById/" + clave;
            return $http.get(endPoint);
        }

        //Obtener todos los registros del usuario que inicio sesion
        service.getbyclave = function (clave) {
            var endPoint = API + "Capitulos/GetByClaveAutor/" + clave;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var request = $http({
                method: "put",
                url: API + "Capitulos/Update/",
                headers: { 'Content-Type': 'application/json' },
                data: registro
            });
            return request;
        }

        service.deleteAutorIIE = function (id) {
            var endPoint = API + "AutorInternoCapitulo/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.deleteAutorExt = function (id) {
            var endPoint = API + "AutorExternoCapitulo/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.deleteEditor = function (id) {
            var endPoint = API + "EditorCapitulo/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.ValidarExistencia = function (id) {
            var endPoint = API + "Solicitud/ValidarRechazoAdminCapitulo/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.updateEstado = function (Registro) {
            var endPoint = API + "Capitulos/UpdateEstado/" + Registro;
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

        service.mailNotificacionConCoautores = function (Registro) {
            var endPoint = API + "Correo/SendNotificacionConCoautores?block=no";
            return $http.post(endPoint, Registro);
        }



        service.getByCapitulo = function (id) {
            var endPoint = API + "AutorInternoCapitulo/GetByCapitulo/" + id;
            return $http.get(endPoint);
        }




        service.getByCapituloExt = function (id) {
            var endPoint = API + "AutorExternoCapitulo/GetByCapitulo/" + id;
            return $http.get(endPoint);
        }


        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }


        return service;


       
    }
})();