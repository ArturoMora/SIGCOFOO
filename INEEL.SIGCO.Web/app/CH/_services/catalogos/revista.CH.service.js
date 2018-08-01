(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("RevistaService", ["$http", "globalGet", RevistaService]);

    function RevistaService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Revista/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "Revista/GetById/" + id;
            return $http.get(endPoint);
        }


        //Obtener  por id
        service.getByNombre = function (id) {
            var endPoint = API + "Revista/GetByNombre/" + id;
            return $http.get(endPoint);
        }

        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "Revista/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "Revista/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Revista/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();