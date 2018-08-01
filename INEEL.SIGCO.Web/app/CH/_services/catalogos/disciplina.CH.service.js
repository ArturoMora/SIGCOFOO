(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("DisciplinaService", ["$http", "globalGet", DisciplinaService]);

    function DisciplinaService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Disciplinas/GetAllAdmin";
            return $http.get(endPoint);
        }
        ////Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Disciplinas/GetById/" + id;
            return $http.get(endPoint);
        }

        //////Actualizar campo
        service.Update = function (disciplina) {
            var endPoint = API + "Disciplinas/Update/" + disciplina;
            return $http.put(endPoint, disciplina);
        }

        ////Agregar disciplina
        service.Add = function (disciplina) {
            var endPoint = API + "Disciplinas/Create/" + disciplina;
            return $http.post(endPoint, disciplina);
        }
        //Actualizar estado
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Disciplinas/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        //Obtener Campos
        service.GeCampos = function () {
            var endPoint = API + "Campos/GetAll";
            return $http.get(endPoint);
        }
        return service;
    }
})();