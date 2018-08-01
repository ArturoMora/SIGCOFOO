(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("TipoPagoService", ["$http", "globalGet", TipoPagoService]);

    function TipoPagoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getAll = function () {
            var endPoint = API + "TipoPagos/GetAll";
            return $http.get(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "TipoPagos/GetById/" + id;
            return $http.get(endPoint);
        }

        service.create = function (registro) {
            var endpoint = API + "TipoPagos/Create";
            return $http.post(endpoint, registro);
        }

        service.update = function (registro) {
            var endpoint = API + "TipoPagos/Update";
            return $http.put(endpoint, registro);
        }

        return service;

    }

})();