(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("tipoAccesoService", ["$http", "globalGet", tipoAccesoService]);

    function tipoAccesoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.get = function () {
            var endPoint = API + "TipoAccesoGI/GetAll";
            return $http.get(endPoint);
        }

        return service;

    }

})();