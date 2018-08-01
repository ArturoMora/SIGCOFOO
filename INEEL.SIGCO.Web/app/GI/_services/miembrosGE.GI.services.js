(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("miembrosGEService", ["$http", "globalGet", miembrosGEService]);

    function miembrosGEService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.get = function (id) {
            var endPoint = API + "MiembrosGE/GetById/"+id;
            return $http.get(endPoint,id);
        }

        service.getCorreos = function (id) {
            var endPoint = API + "MiembrosGE/getCorreos/" + id;
            return $http.get(endPoint, id);
        }

        return service;

    }

})();