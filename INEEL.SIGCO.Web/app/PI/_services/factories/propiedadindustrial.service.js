(function () {
    "use strict";

    angular
        .module("ineel.GEN.services")
        .factory("PropiedadIndustrialService", [
            "$http",
            "globalGet",
            PropiedadIndustrialService
        ]);

    function PropiedadIndustrialService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        // crear PI
        service.createpi = function (da) {
            var endpoint = API + "PropiedadIndustrial/Create";
            return $http.post(endpoint, da);
        };

        // crear PI
        service.createpich = function (da) {
            var endpoint = API + "PropiedadIndustrial/CreateCH";
            return $http.post(endpoint, da);
        };

        // crear PI
        service.updatepi = function (da) {
            var endpoint = API + "PropiedadIndustrial/Update";
            return $http.put(endpoint, da);
        };

        // Obetner PIs 
        service.getpiinstituto = function () {
            var endpoint = API + "PropiedadIndustrial/GetAllInstituto";
            return $http.get(endpoint);
        };

        // Obtener PIs 
        service.getpireporte = function (obj) {
            var endpoint = API + "PropiedadIndustrial/GetAllPropiedadInstitutoReporte";
            return $http.post(endpoint,obj);
        };


        // Obetner PI by Id
        service.getbyid = function (id) {
            var endpoint = API + "PropiedadIndustrial/GetById/" + id;
            return $http.get(endpoint);
        };

        //getPropiedadIndustrialbyclave
        service.getPropiedadIndustrialbyclave = function (clave) {
            var endpoint = API + "PropiedadIndustrial/GetByClavePersona/" + clave;
            return $http.get(endpoint);
        }
        //getPropiedadIndustrialbyclave
        service.getdatosgrafica = function () {
            var endpoint = API + "PropiedadIndustrial/ObtenDatosGrafica/" ;
            return $http.get(endpoint);
        }

        //eliminar PI 
        service.deleteda = function (clave) {
            var endpoint = API + "PropiedadIndustrial/Delete/" + clave;
            return $http.delete(endpoint);
        }

        //historial 

        // Obetner PI by Id
        service.getbypi = function (id) {
            var endpoint = API + "HistorialPi/GetByPI/" + id;
            return $http.get(endpoint);
        };

        // crear PI
        service.createhistorialpi = function (registro) {
            var endpoint = API + "HistorialPi/Create";
            return $http.post(endpoint, registro);
        };

        // crear PI
        service.updatehistorialpi = function (registro) {
            var endpoint = API + "HistorialPi/Update";
            return $http.put(endpoint, registro);
        };

        // get historial by id 
        service.gethistorialbyid = function (id) {
            var endpoint = API + "HistorialPi/GetById/" + id;
            return $http.get(endpoint);
        };

        // get historial by id 
        service.deletehistorial = function (id) {
            var endpoint = API + "HistorialPi/Delete/" + id;
            return $http.delete(endpoint);
        };

        // Obetner PI by Id
        service.getDatosGrafica = function () {
            var endpoint = API + "PropiedadIndustrial/ObtenDatosGrafica";
            return $http.get(endpoint);
        };

        //obtener registro  sobre propiedad industrial y tipo de propiedad
        service.getbyidPropiedadIndustrial = function (id) {
            var endPoint = API + "PropiedadIndustrial/GetByIdYTipoPropiedad/" + id;
            return $http.get(endPoint);
        }

        //getPropiedadIndustrialbyclave
        service.getPropiedadIndustrialPorPersona = function (id) {
            var endpoint = API + "PropiedadIndustrial/GetPropiedadIndustrialPorPersona/" + id;
            return $http.get(endpoint);
        }

        return service;

    }

}());