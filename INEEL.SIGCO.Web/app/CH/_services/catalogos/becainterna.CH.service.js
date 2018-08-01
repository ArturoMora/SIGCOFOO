(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("BecaInternaService", ["$http", "globalGet", BecaInternaService]);

    function BecaInternaService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "BecaInterna/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "BecaInterna/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar
        service.Update = function (asociacion) {
            var endPoint = API + "BecaInterna/Update/" + asociacion;
            return $http.put(endPoint, asociacion);
        }

        //Agregar
        service.Add = function (registro) {
            var endPoint = API + "BecaInterna/Create/" + registro;
            return $http.post(endPoint, registro);
        }

        //Actualizar estado
        service.UpdateEstado = function (registro) {
            var endPoint = API + "BecaInterna/UpdateEstado/" + registro;
            return $http.put(endPoint, registro);
        }
        return service;
    }
})();