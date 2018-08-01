(function () {
    "use strict";
    var app = angular.module("ineel.controllers");
    app.factory("IndicadoresMTService", ["$http", "globalGet", IndicadoresMTService]);

    function IndicadoresMTService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

       
        ////AutorIIE
        service.AddAccesoModulosOC = function (Registro) {
            var endPoint = API + "AccesoModulosOC/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //AutorCapitulosExt
        service.AddAccesoModulos = function (Registro) {
            var endPoint = API + "AccesoModulos/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //AutorCapitulosExt
        service.getAccesosMT = function (id) {
            var endPoint = API + "AccesoModulos/accesosMT/" + id;
            return $http.get(endPoint);
        }

        
        return service;
    }
})();