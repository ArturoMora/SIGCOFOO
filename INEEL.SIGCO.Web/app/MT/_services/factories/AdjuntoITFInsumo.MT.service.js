
(function () {
    "use strict";

    angular
        .module("ineel.MT.services")
        .factory("AdjuntoITFInsumoService", ["$http", "globalGet", AdjuntoITFInsumoService]);

    function AdjuntoITFInsumoService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas

            ////Inicializacion de variables
            var API = globalGet.get("api");
            var service = {};


            service.deleteAdjuntoITFInsumo = function (id) {
                var endPoint = API + "AdjuntoITFInsumo/Delete/" + id;
                return $http.delete(endPoint);
            }
            service.AddAdjuntoITFInsumo = function (registro) {
                var endPoint = API + "AdjuntoITFInsumo/Create";
                return $http.post(endPoint, registro);
            }
            return service;

    }

}());