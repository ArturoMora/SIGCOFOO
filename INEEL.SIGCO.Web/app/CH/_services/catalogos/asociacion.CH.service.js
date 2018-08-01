(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("AsociacionService", ["$http", "globalGet", AsociacionService]);

    function AsociacionService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Asociacion/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Asociacion/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar
        service.Update = function (asociacion) {
            var endPoint = API + "Asociacion/Update/" + asociacion;
            return $http.put(endPoint, asociacion);
        }

        //Agregar ambito
        service.Add = function (asociacion) {
            var endPoint = API + "Asociacion/Create/" + asociacion;
            return $http.post(endPoint, asociacion);
        }

        //Actualizar estado
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Asociacion/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }
        return service;
    }
})();