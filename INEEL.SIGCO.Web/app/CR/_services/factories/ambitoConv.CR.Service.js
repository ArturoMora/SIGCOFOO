(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("AmbitosConvCRService", [
        "$http",
        "globalGet",
        AmbitosConvCRService
        ]);

    function AmbitosConvCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        

        // Get AmbitosConv
        service.getAmbitosConv = function () {
            var endpoint = API + "AmbitoConv/GetAll";
            return $http.get(endpoint);
        };

        // Get AmbitoConvById
        service.getAmbitoConv = function (ambitoConvId) {
            var endpoint = API + "AmbitoConv/Get/" + ambitoConvId;
            return $http.get(endpoint);
        }

        //Create AmbitoConv
        service.create = function (ambitoConv) {
            var endpoint = API + "AmbitoConv/Create/" + ambitoConv;
            return $http.post(endpoint, ambitoConv);
        }

        // Update AmbitoConv
        service.update = function (ambitoConv) {
            var endpoint = API + "AmbitoConv/Update";
            return $http.put(endpoint, ambitoConv);
        }

        // Delete AmbitoConv
        service.delete = function (ambitoConvId) {
            var endpoint = API + "AmbitoConv/Delete/" + ambitoConvId;
            return $http.delete(endpoint);
        }
        service.ambitoAllByEstado = function () {
            var endPoint = API + "AmbitoConv/GetAllByEstado";
            return $http.get(endPoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "AmbitoConv/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;
    }

}());