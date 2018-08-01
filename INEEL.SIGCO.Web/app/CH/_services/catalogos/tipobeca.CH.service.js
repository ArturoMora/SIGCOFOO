(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("TipoBecaService", ["$http", "globalGet", TipoBecaService]);

    function TipoBecaService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "TipoBeca/GetAllAdmin";
            return $http.get(endPoint);
        }
        ////Obtener por id
        service.getById = function (id) {
            var endPoint = API + "TipoBeca/GetById/" + id;
            return $http.get(endPoint);
        }
        ////////Actualizar
        service.Update = function (registro) {
            var endPoint = API + "TipoBeca/Update/" + registro;
            return $http.put(endPoint, registro);
        }

        ////Agregar tipobeca
        service.Add = function (registro) {
            var endPoint = API + "TipoBeca/Create/" + registro;
            return $http.post(endPoint, registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (registro) {
            var endPoint = API + "TipoBeca/UpdateEstado/" + registro;
            return $http.put(endPoint, registro);
        }
        return service;
    }
})();