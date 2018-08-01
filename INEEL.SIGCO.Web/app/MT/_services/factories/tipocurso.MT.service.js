(function () {
    "use strict";
    angular
        .module("ineel.MT.services")
        .factory("TipoCursoService", ["$http", "globalGet", TipoCursoService]);

    function TipoCursoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "TipoCurso/GetAll";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "TipoCurso/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "TipoCurso/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "TipoCurso/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "TipoCurso/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();