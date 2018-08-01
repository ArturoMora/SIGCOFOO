(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("EstadoPublicacionService", ["$http", "globalGet", EstadoPublicacionService]);

    function EstadoPublicacionService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "EstadoPublicacion/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "EstadoPublicacion/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (ambito) {
            var endPoint = API + "EstadoPublicacion/Update/" + ambito;
            return $http.put(endPoint, ambito);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "EstadoPublicacion/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "EstadoPublicacion/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();