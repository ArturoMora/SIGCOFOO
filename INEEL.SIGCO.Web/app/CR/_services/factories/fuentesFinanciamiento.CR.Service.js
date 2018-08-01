(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("FuentesFinanciamientoCRService", [
        "$http",
        "globalGet",
        FuentesFinanciamientoCRService
        ]);

    function FuentesFinanciamientoCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get FuentesFinanciamiento
        service.getFuentesFinanciamiento = function () {
            var endpoint = API + "FuenteFinanciamiento/GetAll";
            return $http.get(endpoint);
        };
        // Get FuentesFinanciamientoWithAllFks
        service.getFuentesFinanciamientoAllFKs = function () {
            var endpoint = API + "FuenteFinanciamiento/GetAllFKs/";
            return $http.get(endpoint);
        };

        // Get FuenteFinanciamiento by tipo
        service.getFuenteByTipo = function (tipoFuenteId) {
            var endpoint = API + "FuenteFinanciamiento/GetAllByTipo/" + tipoFuenteId;
            return $http.get(endpoint);
        };

        // Get FuenteFinanciamientoById
        service.getFuenteFinanciamiento = function (fuenteFinanciamientoId) {
            var endpoint = API + "FuenteFinanciamiento/Get/" + fuenteFinanciamientoId;
            return $http.get(endpoint);
        }

        // Get FuenteFinanciamientoFKById
        service.getFuenteFinanciamientoFK = function (fuenteFinanciamientoId) {
            var endpoint = API + "FuenteFinanciamiento/GetFKById/" + fuenteFinanciamientoId;
            return $http.get(endpoint);
        }
        // Get FondoProgramaFKById
        service.getFuenteFinanciamientoFKFP = function (fuenteFinanciamientoId) {
            var endpoint = API + "FuenteFinanciamiento/GetFKFPById/" + fuenteFinanciamientoId;
            return $http.get(endpoint);
        }

        //Create FuenteFinanciamiento
        service.create = function (fuenteFinanciamiento) {
            var endpoint = API + "FuenteFinanciamiento/Create/" + fuenteFinanciamiento;
            return $http.post(endpoint, fuenteFinanciamiento);
        }

        // Update FuentesFinanciamiento
        service.update = function (fuenteFinanciamiento) {
            var endpoint = API + "FuenteFinanciamiento/Update";
            return $http.put(endpoint, fuenteFinanciamiento);
        }

        // Delete FuenteFinanciamiento
        service.delete = function (fuenteFinanciamientoId) {
            var endpoint = API + "FuenteFinanciamiento/Delete/" + fuenteFinanciamientoId;
            return $http.delete(endpoint);
        }

        // Delete FuenteFinanciamiento con llaves foraneas
        service.DeleteFuenteWithFKS = function (fuenteFinanciamientoId) {
            var endpoint = API + "FuenteFinanciamiento/DeleteFuenteWithFKS/" + fuenteFinanciamientoId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "FuenteFinanciamiento/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        //Obtener TiposFuenteFinanciamiento
        service.TiposFuenteFinanciamientoGetEstado = function () {
            var endPoint = API + "TipoFuenteFinanciamiento/GetAllByEstado";
            return $http.get(endPoint);
        }
        //Obtener TiposFuenteFinanciamiento
        service.TiposFuenteFinanciamientoGet = function () {
            var endPoint = API + "TipoFuenteFinanciamiento/GetAll";
            return $http.get(endPoint);
        }

        //Obtener Paises
        service.PaisesGet = function () {
            var endPoint = API + "Pais/GetAllByEstado";
            return $http.get(endPoint);
        }
        return service;
    }

}());