(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("TipoProductoServicioCRService", [
        "$http",
        "globalGet",
        TipoProductoServicioService
        ]);

    function TipoProductoServicioService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.get = function (tipoProductoServicioId) {
            var endpoint = API + "TipoProductoServicio/Get/" + tipoProductoServicioId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (tipoProductoServicio) {
            var endpoint = API + "TipoProductoServicio/Update";
            return $http.put(endpoint, tipoProductoServicio);
        }

        // Create
        service.create = function (tipoProductoServicio) {
            var endpoint = API + "TipoProductoServicio/Create";
            return $http.post(endpoint, tipoProductoServicio);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "TipoProductoServicio/GetAll";
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (tipoProductoServicioId) {
            var endpoint = API + "TipoProductoServicio/Delete/" + tipoProductoServicioId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "TipoProductoServicio/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());