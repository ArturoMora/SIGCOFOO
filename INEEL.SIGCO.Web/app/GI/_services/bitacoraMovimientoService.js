(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("bitacoraMovimientoService", ["$http", "globalGet", bitacoraMovimientoService]);

    function bitacoraMovimientoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GetAllByRegistroId = function (registroId, OcsId) {
            var endPoint = API + "BitacoraMovimientosGI/GetAllByRegistroId/" + registroId + "/" + OcsId;
            return $http.get(endPoint);
        }
        return service;

    }

})();