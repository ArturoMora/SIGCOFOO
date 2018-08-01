(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("SegmentosMercadoCRService", [
        "$http",
        "globalGet",
        SegmentosMercadoCRService
        ]);

    function SegmentosMercadoCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get SegmentosMercado
        service.getSegmentosMercado = function () {
            var endpoint = API + "SegmentoMercado/GetAll";
            return $http.get(endpoint);
        };

        // Get SegmentosMercado
        service.getSegmentoMercado = function (segmentoMercadoId) {
            var endpoint = API + "SegmentoMercado/Get/" + segmentoMercadoId;
            return $http.get(endpoint);
        }

        //Create SegmentosMercado
        service.create = function (segmentoMercado) {
            var endpoint = API + "SegmentoMercado/Create/" + segmentoMercado;
            return $http.post(endpoint, segmentoMercado);
        }

        // Update SegmentosMercado
        service.update = function (segmentoMercado) {
            var endpoint = API + "SegmentoMercado/Update";
            return $http.put(endpoint, segmentoMercado);
        }

        // Delete SegmentosMercado
        service.delete = function (segmentoMercadoId) {
            var endpoint = API + "SegmentoMercado/Delete/" + segmentoMercadoId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "SegmentoMercado/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());