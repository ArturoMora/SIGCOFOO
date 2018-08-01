(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("TipoAccesoService", ["$http", "globalGet", TipoAccesoService]);

    function TipoAccesoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getAll = function () {
            var endPoint = API + "TipoAccesoGI/GetAll";
            return $http.get(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "TipoAccesoGI/GetByID/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "TipoAccesoGI/Update";
            return $http.put(endpoint, registro);
        }

        return service;

    }

})();