
(function () {
    "use strict";

    angular
        .module("ineel.MT.services")
        .factory("buscarPersonasService", ["$http", "globalGet", personasService]);

    function personasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        //by ACH:        
        //$http.POST
        service.GetPersonas = function (personas) {
            var endPoint = API + "Personas/GetPersonas/";
            return $http.post(endPoint, personas);
        }
        return service;


    }

}());