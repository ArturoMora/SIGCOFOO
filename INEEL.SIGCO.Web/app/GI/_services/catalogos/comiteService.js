(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("ComiteService", ["$http", "globalGet", ComiteService]);

    function ComiteService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getAll = function () {
            var endPoint = API + "Comite/GetAll";
            return $http.get(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "Comite/GetById/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "Comite/Update";
            return $http.put(endpoint, registro);
        }

        service.create = function (registro) {
            var endpoint = API + "Comite/Create";
            return $http.post(endpoint, registro);
        }

        return service;

    }

})();