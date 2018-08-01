(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("AreaSNIService", ["$http", "globalGet", AreaSNIService]);

    function AreaSNIService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "AreaSNI/GetAllAdmin";
            return $http.get(endPoint);
        }

        //Obtener area por id
        service.getById = function (id) {
            var endPoint = API + "AreaSNI/GetById/" + id;
            return $http.get(endPoint);
        }


        //Actualizar area
        service.Update = function (area) {
            var endPoint = API + "AreaSNI/Update/" + area;
            return $http.put(endPoint,area);
        }


        //Agregar area
        service.Add = function (Registro) {
            var endPoint = API + "AreaSNI/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "AreaSNI/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        return service;
    }
})();