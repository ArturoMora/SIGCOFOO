(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("MECService", ["$http", "globalGet", MECService]);

    function MECService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getAllTecnica = function () {
            var endPoint = API + "ManualCompetenciaTecnica/GetAll";
            return $http.get(endPoint);
        }

        service.getbyidTecnica = function (Obj) {
            var endPoint = API + "ManualCompetenciaTecnica/GetById/" + Obj;
            return $http.get(endPoint);
        }

        service.createTecnica = function (registro) {
            var endpoint = API + "ManualCompetenciaTecnica/Create/";
            return $http.post(endpoint, registro);
        }

        service.updateTecnica = function (idioma) {
            var endpoint = API + "ManualCompetenciaTecnica/Update/";
            return $http.put(endpoint, idioma);
        }

        service.deleteTecnica = function (id) {
            var endpoint = API + "ManualCompetenciaTecnica/Delete/" + id;
            return $http.delete(endpoint);
        }
        //////Conductual/////////
        service.getAllConductual = function () {
            var endPoint = API + "ManualCompetenciaConductual/GetAll";
            return $http.get(endPoint);
        }

        service.getbyidConductual = function (Obj) {
            var endPoint = API + "ManualCompetenciaConductual/GetById/" + Obj;
            return $http.get(endPoint);
        }

        service.createConductual = function (idioma) {
            var endpoint = API + "ManualCompetenciaConductual/Create/";
            return $http.post(endpoint, idioma);
        }

        service.updateConductual = function (idioma) {
            var endpoint = API + "ManualCompetenciaConductual/Update/";
            return $http.put(endpoint, idioma);
        }

        service.deleteConductual = function (id) {
            var endpoint = API + "ManualCompetenciaConductual/Delete/" + id;
            return $http.delete(endpoint);
        }
        /////////Extras//////
        service.getPeriodo = function () {
            var endPoint = API + "PeriodoEvaluacion/GetAllSort";
            return $http.get(endPoint);
        }
        ////////Consultaaa/////
        service.getAllTecnicaConsulta = function () {
            var endPoint = API + "ManualCompetenciaTecnica/GetAllConsulta";
            return $http.get(endPoint);
        }
        service.getAllConductualConsulta = function () {
            var endPoint = API + "ManualCompetenciaConductual/GetAllConsulta";
            return $http.get(endPoint);
        }

        return service;

    }

})();