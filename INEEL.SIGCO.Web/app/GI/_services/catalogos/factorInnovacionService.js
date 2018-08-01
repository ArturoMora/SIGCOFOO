(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("FactorInnovacionService", ["$http", "globalGet", FactorInnovacionService]);

    function FactorInnovacionService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getAll = function () {
            var endPoint = API + "FactorInnovacion/GetAll";
            return $http.get(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "FactorInnovacion/GetById/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "FactorInnovacion/Update";
            return $http.put(endpoint, registro);
        }

        return service;

    }

})();