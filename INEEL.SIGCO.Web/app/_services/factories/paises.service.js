(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory("PaisesService", [
            "$http",
            "globalGet",
            PaisesService
        ]);

    function PaisesService($http, globalGet) { //servicios personales llamas a los metodos del WEBApi
        var API = globalGet.get("api");
        var service = {};

        // Get Paises
        service.getPaises = function () {
            var endpoint = API + "Paises/GetPais";
            return $http.get(endpoint);
        };
        // Get Estado
        service.getEstado = function (Id) {
            var endpoint = API + "Paises/GetEstado/" + Id;
            return $http.get(endpoint);
        };
        // Get Municipio
        service.getMunicipio = function (Id) {
            var endpoint = API + "Paises/GetMunicipio/" + Id;
            return $http.get(endpoint);
        };
        return service;
    }
}());