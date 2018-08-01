(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("CertificacionesService", ["$http", "globalGet", CertificacionesService]);

    function CertificacionesService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Certificacion/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "Certificacion/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "Certificacion/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "Certificacion/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Certificacion/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        ////Obtener carrrera por id
        service.IdiomagetById = function () {
            var endPoint = API + "Idioma/GetAll";
            return $http.get(endPoint);
        }
        return service;
    }
})();