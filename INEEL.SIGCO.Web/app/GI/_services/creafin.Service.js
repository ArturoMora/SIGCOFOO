(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("creafinService", ["$http", "globalGet", creafinService]);

    function creafinService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GatAllCompendio = function () {
            var endPoint = API + "ProductoGISolicitud/GetAllCompendio";
            return $http.get(endPoint);
        }
        service.GatAllCompendio2 = function () {
            var endPoint = API + "ProductoGISolicitud/GetAllCompendio2";
            return $http.get(endPoint);
        }
        service.GetConsultaCompendio = function (obj) {
            var endPoint = API + "ProductoGISolicitud/GetConsultaCompendio/"+obj;
            return $http.post(endPoint,obj);
        }
        service.GetFactoresInnovacion = function () {
            var endPoint = API + "ProductoGISolicitud/GetFactoresInnovacion";
            return $http.get(endPoint);
        }
        return service;

    }

})();