
(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory("buscarProyectosPorSubprogramaService", ["$http", "globalGet", buscarProyectosPorSubprogramaService]);

    function buscarProyectosPorSubprogramaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};
        //alert('buscarProyectosPorSubprogramaService');
        //$http.POST
        service.GetProyectos = function (proyecto) {
            var endPoint = API + "Proyectos/GetProyectos/";
            return $http.post(endPoint, proyecto);
        }

        return service;


    }

}());