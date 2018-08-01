(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory("NotificacionService", ["$http", "globalGet", NotificacionService]);

    function NotificacionService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        
        // Get all registers
        service.notificacionesSolicitudes = function (id, clave) {
            
            var endPoint = API + "Notificacion/GetCountSolicitudesNotification/"+id+"/"+clave;
            return $http.get(endPoint);
        }

        service.GetAllByEvaluadorFI = function (clave) {
            var endPoint = API + "ProductoGISolicitud/GetAllByEvaluadorFI/" + clave;
            return $http.get(endPoint);
        }
        
        return service;

    }

}());