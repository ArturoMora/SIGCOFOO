(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("CampoService", ["$http", "globalGet", CampoService]);

    function CampoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Campos/GetAllAdmin";
            return $http.get(endPoint);
        }
        ////Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Campos/getById/" + id;
            return $http.get(endPoint);
        }
        //////Actualizar campo
        service.Update = function (campo) {
            var endPoint = API + "Campos/Update/" + campo;
            return $http.put(endPoint, campo);
        }

        ////Agregar ambito
        service.Add = function (campo) {
            var endPoint = API + "Campos/Create/" + campo;
            return $http.post(endPoint, campo);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Campos/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();