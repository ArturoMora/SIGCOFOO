(function () {
    "use strict";
    angular
        .module("ineel.MT.services")
        .factory("TipoSoftwareService", ["$http", "globalGet", TipoSoftwareService]);

    function TipoSoftwareService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "TipoSoftware/GetAll";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "TipoSoftware/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "TipoSoftware/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "TipoSoftware/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "TipoSoftware/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();