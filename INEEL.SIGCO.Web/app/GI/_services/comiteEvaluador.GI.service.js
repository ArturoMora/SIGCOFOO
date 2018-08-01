(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("comiteService", ["$http", "globalGet", comiteService]);

    function comiteService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.get = function () {
            var endPoint = API + "Comite/GetAll";
            return $http.get(endPoint);
        }
        
        return service;

    }

})();