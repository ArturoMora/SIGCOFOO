(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("PaisService", ["$http", "globalGet", PaisService]);

    function PaisService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Pais/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener todos los registros con estado Activo(1)
        service.getAllByEstado = function () {
            var endPoint = API + "Pais/GetAllByEstado";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "Pais/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "Pais/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "Pais/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Pais/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();