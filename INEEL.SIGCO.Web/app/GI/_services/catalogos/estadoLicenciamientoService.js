(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("EstadoLicenciamientoService", ["$http", "globalGet", EstadoLicenciamientoService]);

    function EstadoLicenciamientoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getAll = function () {
            var endPoint = API + "EstadoLicenciamiento/GetAll";
            return $http.get(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "EstadoLicenciamiento/GetById/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "EstadoLicenciamiento/Update";
            return $http.put(endpoint, registro);
        }

        return service;

    }

})();