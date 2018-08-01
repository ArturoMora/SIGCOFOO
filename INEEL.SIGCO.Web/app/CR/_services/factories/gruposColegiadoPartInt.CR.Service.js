(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("GruposColegiadoPartIntCRService", [
        "$http",
        "globalGet",
        GruposColegiadoPartIntCRService
        ]);

    function GruposColegiadoPartIntCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get GrupoColegiadoPartInt
        service.getGruposColegiadoPartInt = function () {
            var endpoint = API + "GrupoColegiadoPartInt/GetAll";
            return $http.get(endpoint);
        };

        // Get GrupoColegiadoPartIntWithAllFKs
        service.getGrupoColegiadoPartIntAllFKs = function () {
            var endpoint = API + "GrupoColegiadoPartInt/GetAllFKs";
            return $http.get(endpoint);
        };

        // Get GrupoColegiadoPartIntById
        service.getGrupoColegiadoPartInt = function (grupoColegiadoPartIntId) {
            var endpoint = API + "GrupoColegiadoPartInt/Get/" + grupoColegiadoPartIntId;
            return $http.get(endpoint);
        }

        // Get PersonasPartIntFKById
        service.getGrupoColegiadoPartIntFKById = function (GrupoColegiadoPartIntId) {
            var endpoint = API + "GrupoColegiadoPartInt/GetFKById/" + GrupoColegiadoPartIntId;
            return $http.get(endpoint);
        }

        //Create GrupoColegiadoPartInt
        service.create = function (grupoColegiadoPartInt) {
            var endpoint = API + "GrupoColegiadoPartInt/Create/" + grupoColegiadoPartInt;
            return $http.post(endpoint, grupoColegiadoPartInt);
        }

        // Update GruposColegiadoPartInt
        service.update = function (grupoColegiadoPartInt) {
            var endpoint = API + "GrupoColegiadoPartInt/Update";
            return $http.put(endpoint, grupoColegiadoPartInt);
        }

        // Delete GrupoColegiadoPartInt
        service.delete = function (grupoColegiadoPartIntId) {
            var endpoint = API + "GrupoColegiadoPartInt/Delete/" + grupoColegiadoPartIntId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "GrupoColegiadoPartInt/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        // Obtiene las Naturalezas de Interaccion by Estado
        service.getNaturalezasInteraccionEstado = function () {
            var endPoint = API + "NaturalezaInteraccion/GetAllByEstado";
            return $http.get(endPoint);
        }

        // Obtiene las Naturalezas de Interaccion without estado
        service.getNaturalezasInteraccion = function () {
            var endPoint = API + "NaturalezaInteraccion/GetAll";
            return $http.get(endPoint);
        }
        // Obtiene el integrante de un grupo colegiado
        service.getIntegranteGC = function (IntegranteGrupoColegiadoPartIntId) {
            var endPoint = API + "IntegranteGrupoColegiadoExterno/Get/" + IntegranteGrupoColegiadoPartIntId;
            return $http.get(endPoint);
        }
        
        service.deleteIntegrante = function (id) {
            var endPoint = API + "IntegranteGrupoColegiadoExterno/Delete/" + id;
            return $http.delete(endPoint);
        }
        

        service.deleteIntegranteGrupoExterno = function (id) {
            var endPoint = API + "IntegranteGrupoColegiadoExterno/DeleteIntegrantesGrupo/" + id;
            return $http.delete(endPoint);
        }

        service.deleteIntegranteGrupoInterno = function (id) {
            var endPoint = API + "IntegranteGrupoColegiadoInterno/DeleteIntegrantesGrupo/" + id;
            return $http.delete(endPoint);
        }

        // Update GruposColegiadoPartInt
        service.updateIntegrante = function (IntegranteId) {
            var endpoint = API + "IntegranteGrupoColegiadoExterno/Update";
            return $http.put(endpoint, IntegranteId);
        }
        

        //Create GrupoColegiadoPartInt
        service.registraIntegranteGCExterno = function (obj) {
            var endpoint = API + "IntegranteGrupoColegiadoExterno/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        service.deleteIntegranteGCExterno = function (id) {
            var endPoint = API + "IntegranteGrupoColegiadoExterno/Delete/" + id;
            return $http.delete(endPoint);
        }

        // Obtiene el integrantes internos de un grupo colegiado
        service.getIntegranteInternoGC = function (id) {
            var endPoint = API + "IntegranteGrupoColegiadoInterno/GetByGrupo/" + id;
            return $http.get(endPoint);
        }

        service.deleteIntegranteInternoGC = function (id) {
            var endPoint = API + "IntegranteGrupoColegiadoInterno/Delete/" + id;
            return $http.delete(endPoint);
        }

        //Create GrupoColegiadoPartInt
        service.registraIntegranteGCInterno = function (obj) {
            var endpoint = API + "IntegranteGrupoColegiadoInterno/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        return service;
    }

}());