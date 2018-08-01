
(function () {
    "use strict";

    angular
        .module("ineel.CH.services")
        .factory("buscarProyectosService", ["$http", "globalGet", buscarProyectosService]);

    function buscarProyectosService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        //by ACH:        
        //$http.POST
        service.GetProyectos = function (proyecto) {
            var endPoint = API + "Proyectos/GetProyectos/";
            return $http.post(endPoint, proyecto);
        }

        return service;


    }

}());