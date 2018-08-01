(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("LineasDesarrolloTecnologicoCRService", [
        "$http",
        "globalGet",
        LineasDesarrolloTecnologicoCRService
        ]);

    function LineasDesarrolloTecnologicoCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get LineasDesarrolloTecnologico
        service.getLineasDesarrolloTecnologico = function () {
            var endpoint = API + "LineaDesarrolloTecnologico/GetAll";
            return $http.get(endpoint);
        };

        // Get LineasDesarrolloTecnologico
        service.getLineaDesarrolloTecnologico = function (lineaDesarrolloTecnologicoId) {
            var endpoint = API + "LineaDesarrolloTecnologico/Get/" + lineaDesarrolloTecnologicoId;
            return $http.get(endpoint);
        }

        //Create LineasDesarrolloTecnologico
        service.create = function (lineaDesarrolloTecnologico) {
            var endpoint = API + "LineaDesarrolloTecnologico/Create/" + lineaDesarrolloTecnologico;
            return $http.post(endpoint, lineaDesarrolloTecnologico);
        }

        // Update LineasDesarrolloTecnologico
        service.update = function (lineaDesarrolloTecnologico) {
            var endpoint = API + "LineaDesarrolloTecnologico/Update";
            return $http.put(endpoint, lineaDesarrolloTecnologico);
        }

        // Delete LineasDesarrolloTecnologico
        service.delete = function (lineaDesarrolloTecnologicoId) {
            var endpoint = API + "LineaDesarrolloTecnologico/Delete/" + lineaDesarrolloTecnologicoId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "LineaDesarrolloTecnologico/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());