(function () {
    "use strict";
    var app = angular.module("ineel.services");

    app.factory("BitacosaSolicitudesService", ["$http", "globalGet", BitacosaSolicitudesService]);

    function BitacosaSolicitudesService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        //obtener registro 
        service.getbyid = function (id,id2) {
            var endPoint = API + "BitacoraSolicitudes/GetById/" + id+"/"+id2;
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }


        
        return service;
    }
})();