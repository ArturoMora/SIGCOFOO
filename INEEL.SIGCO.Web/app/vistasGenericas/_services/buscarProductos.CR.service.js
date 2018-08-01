
(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("buscarProductosService", ["$http", "globalGet", productosService]);

    function productosService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GetProductos = function (productos) {
            var endPoint = API + "Producto/GetProductosModal/";
            return $http.post(endPoint, productos);
        }
        // Get Productos Para Modal de competidores
        service.GetProductosModalCompetidores = function () {
            var endPoint = API + "Producto/GetProductosModalCompetidores/";
            return $http.get(endPoint);
        }
        return service;



    }

}());