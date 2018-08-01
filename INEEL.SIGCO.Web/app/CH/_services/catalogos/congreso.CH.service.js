(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("CongresoService", ["$http", "globalGet", CongresoService]);

    function CongresoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Congreso/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Congreso/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (Registro) {
            var endPoint = API + "Congreso/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar ambito
        service.Add = function (Registro) {
            var endPoint = API + "Congreso/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Congreso/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();