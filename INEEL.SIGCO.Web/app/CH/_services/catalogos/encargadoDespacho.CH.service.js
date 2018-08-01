(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("EncargadoDespachoService", ["$http", "globalGet", EncargadoDespachoService]);

    function EncargadoDespachoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "EncargadoDespacho/GetAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "EncargadoDespacho/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (registro) {
            var endPoint = API + "EncargadoDespacho/Update/" + registro;
            return $http.put(endPoint, registro);
        }

        //Agregar ambito
        service.Add = function (Registro) {
            var endPoint = API + "EncargadoDespacho/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        return service;
    }
})();