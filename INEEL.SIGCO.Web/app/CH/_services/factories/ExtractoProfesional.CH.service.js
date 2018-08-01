(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("ExtractoProfesionalService", ["$http", "globalGet", ExtractoProfesionalService]);

    function ExtractoProfesionalService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "ExtractoProfesional/Update";
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "ExtractoProfesional/Create";
            return $http.post(endPoint, Registro);
        }
        
        return service;
    }
})();