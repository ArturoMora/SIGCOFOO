
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarConvocatoriasService", ["$http", "globalGet", convocatoriasService]);

    function convocatoriasService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //byACH:        
        //$http.POST
        service.getConvocatoriasAllFKsByEstado = function (convocatorias) {
            var endPoint = API + "Convocatoria/GetConvocatoriasModal/";
            return $http.post(endPoint, convocatorias);
        }
        return service;



    }

}());