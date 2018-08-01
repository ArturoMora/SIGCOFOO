(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("CarreraService", ["$http", "globalGet", CarreraService]);

    function CarreraService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Carreras/GetAllAdmin";
            return $http.get(endPoint);
        }
        ////Obtener carrrera por id
        service.getById = function (id) {
            var endPoint = API + "Carreras/GetById/" + id;
            return $http.get(endPoint);
        }
        //////Actualizar campo
        service.Update = function (carrera) {
            var endPoint = API + "Carreras/Update/" + carrera;
            return $http.put(endPoint, carrera);
        }

        ////Agregar ambito
        service.Add = function (carrera) {
            var endPoint = API + "Carreras/Create/" + carrera;
            return $http.post(endPoint, carrera);
        }

        //Actualizar estado
        service.UpdateEstado = function (carrera) {
            var endPoint = API + "Carreras/UpdateEstado/" + carrera;
            return $http.put(endPoint, carrera);
        }

        //Obtener Disciplinas
        service.DisciplinasGet = function () {
            var endPoint = API + "Disciplinas/GetAll";
            return $http.get(endPoint);
        }
        return service;
    }
})();