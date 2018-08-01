
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarPropuestasService", ["$http", "globalGet", buscarPropuestasService]);

    function buscarPropuestasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        //by ACH:        
        //$http.POST
        service.GetPropuestas = function (propuesta) {
            var endPoint = API + "Propuestas/GetPropuestas/" + propuesta;
            //debugger;
            return $http.post(endPoint, propuesta);
        }

        return service;


    }

}());