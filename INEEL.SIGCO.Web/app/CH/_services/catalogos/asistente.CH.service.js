(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("AsistenteService", ["$http", "globalGet", AsistenteService]);

    function AsistenteService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Asistente/GetAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Asistente/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (ambito) {
            var endPoint = API + "Asistente/Update/" + ambito;
            return $http.put(endPoint, ambito);
        }

        //Agregar ambito
        service.Add = function (Registro) {
            var endPoint = API + "Asistente/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }
        return service;
    }
})();