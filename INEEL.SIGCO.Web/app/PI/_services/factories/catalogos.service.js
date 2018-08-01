(function () {
    "use strict";

    angular
        .module("ineel.GEN.services")
        .factory("CatalogosPIService", [
        "$http",
        "globalGet",
        CatalogosPIService
        ]);

    function CatalogosPIService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // obtener ramas
        service.getramas = function () {
            var endpoint = API + "Ramas/GetAll";
            return $http.get(endpoint);
        };

         // Get ramas activas 
        service.getramasactivas = function () {
            var endpoint = API + "Ramas/GetAllActivas";
            return $http.get(endpoint);
        };

        // crear rama
        service.createrama = function (rama) {
            var endpoint = API + "Ramas/Create";
            return $http.post(endpoint,rama);
        };

        // actualizar rama
        service.updaterama = function (rama) {
            var endpoint = API + "Ramas/Update";
            return $http.put(endpoint,rama);
        };       

        // get by Id
        service.obtenerrama = function (ramaid) {
            var endpoint = API + "Ramas/GetById/"+ramaid;
            return $http.get(endpoint);
        };


        // obtener tipos de propiedad industrial
        service.gettipospin = function () {
            var endpoint = API + "TiposPropiedadIndustrial/GetAll";
            return $http.get(endpoint);
        };

         // Get ramas activas 
         service.gettipospinactivos = function () {
            var endpoint = API + "TiposPropiedadIndustrial/GetAllActivos";
            return $http.get(endpoint);
        };

        // crear tipo de propiedad industrial
        service.createtipopin = function (tipopin) {
            var endpoint = API + "TiposPropiedadIndustrial/Create";
            return $http.post(endpoint,tipopin);
        };

        // actualizar tipo de propiedad industrial
        service.updatetipopin = function (tipopin) {
            var endpoint = API + "TiposPropiedadIndustrial/Update";
            return $http.put(endpoint,tipopin);
        };       

        // get by Id
        service.obtenertipopin = function (tipopinid) {
            var endpoint = API + "TiposPropiedadIndustrial/GetById/"+tipopinid;
            return $http.get(endpoint);
        };

        // obtener tipos de propiedad industrial
        service.getestadosdelproceso = function () {
            var endpoint = API + "EstadosDelProceso/GetAll";
            return $http.get(endpoint);
        };


        // Get estados activos 
        service.getestadosdelprocesoactivos = function () {
            var endpoint = API + "EstadosDelProceso/GetAllActivos";
            return $http.get(endpoint);
        };


        // crear estado del proceso 
        service.createestadodelproceso = function (estado) {
            var endpoint = API + "EstadosDelProceso/Create";
            return $http.post(endpoint,estado);
        };

        // actualizar estado del proceso
        service.updateestadodelproceso = function (estado) {
            var endpoint = API + "EstadosDelProceso/Update";
            return $http.put(endpoint,estado);
        };       

        // get by Id
        service.obtenerestadodelproceso = function (estadoid) {
            var endpoint = API + "EstadosDelProceso/GetById/"+estadoid;
            return $http.get(endpoint);
        };


        return service;
    }

}());