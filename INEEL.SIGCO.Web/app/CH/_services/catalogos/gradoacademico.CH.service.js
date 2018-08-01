(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("GradoAcademicoService", ["$http", "globalGet", GradoAcademicoService]);

    function GradoAcademicoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "GradoAcademico/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "GradoAcademico/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "GradoAcademico/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "GradoAcademico/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "GradoAcademico/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;
    }
})();