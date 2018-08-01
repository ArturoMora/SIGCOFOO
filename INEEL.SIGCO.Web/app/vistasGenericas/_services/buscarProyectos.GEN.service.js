
(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory("buscarProyectosGENService", ["$http", "globalGet", buscarProyectosGENService]);

    function buscarProyectosGENService($http, globalGet) {
        
        var API = globalGet.get("api");
        var service = {};

        //$http.POST
        service.GetProyectos = function (proyecto) {
            var endPoint = API + "Proyectos/GetProyectos/";
            return $http.post(endPoint, proyecto);
        }

        

        return service;


    }

}());