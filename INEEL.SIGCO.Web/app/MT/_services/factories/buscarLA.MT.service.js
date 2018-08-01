
(function () {
    "use strict";

    angular
        .module("ineel.MT.services")
        .factory("buscarLAService", ["$http", "globalGet", buscarLAService]);

    function buscarLAService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los insumos y sus adjuntos
        service.GetLA = function (Ide) {
            var endPoint = API + "InformeTecnicoFinal/GetLA/"+Ide;
            return $http.get(endPoint);
        }

        service.GetPal = function (Palabra) {
            var endpoint = API + "InformeTecnicoFinal/GetPal/" + Palabra;
            return $http.get(endpoint);
        }

        service.GetProy = function (Palabra) {
            var endpoint = API + "InformeTecnicoFinal/GetProy/" + Palabra;
            return $http.get(endpoint);
        }

        //Lee ese insumo de la tabla de solicitudes

        service.GetJefe = function (Palabra) {
            var endpoint = API + "InformeTecnicoFinal/GetJefe/" + Palabra;
            return $http.get(endpoint);
        }
        return service;


    }

}());