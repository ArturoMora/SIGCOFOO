(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("IdiomaService", ["$http", "globalGet", IdiomaService]);

    function IdiomaService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Idioma/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "Idioma/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "Idioma/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "Idioma/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Idioma/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();