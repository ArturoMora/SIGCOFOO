(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ServiciosCRService", [
        "$http",
        "globalGet",
        ServiciosCRService
        ]);

    function ServiciosCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Servicios
        service.getServicios = function () {
            var endpoint = API + "Servicio/GetAll";
            return $http.get(endpoint);
        };

        // Get Servicios
        service.getServicio = function (servicioId) {
            var endpoint = API + "Servicio/Get/" + servicioId;
            return $http.get(endpoint);
        }

        // Get Servicios Para Modal
        service.getServiciosModal = function (servicios) {
            var endPoint = API + "Servicio/GetServiciosModal/";
            return $http.post(endPoint, servicios);
        }

        //Create Servicios
        service.create = function (servicio) {
            var endpoint = API + "servicio/Create/" + servicio;
            return $http.post(endpoint, servicio);
        }

        // Update Servicios
        service.update = function (servicio) {
            var endpoint = API + "Servicio/Update";
            return $http.put(endpoint, servicio);
        }

        // Delete Servicios
        service.delete = function (servicioId) {
            var endpoint = API + "Servicio/Delete/" + servicioId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Servicio/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;
    }

}());