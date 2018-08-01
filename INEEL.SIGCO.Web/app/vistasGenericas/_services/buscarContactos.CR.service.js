
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarContactosService", ["$http", "globalGet", contactosService]);

    function contactosService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //byACH:        
        //$http.POST
        service.GetContactos = function (contactos) {
            var endPoint = API + "Contactos/GetContactosModal/";
            return $http.post(endPoint, contactos);
        }
        return service;



    }

}());