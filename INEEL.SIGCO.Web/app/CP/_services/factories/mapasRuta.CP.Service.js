(function () {
    angular
        .module("ineel.CP.services")
        .factory("MapasRutaCPService", [
            "$http",
            "globalGet",
            MapasRutaCPService
        ]);


    function MapasRutaCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        
        service.GetAllByComunidad = function (idCP) {
            var endpoint = API + "MapasRuta/GetAllByComunidad/"+idCP;
            return $http.get(endpoint);
        };
        //GetAll mapas
        service.getAll = function () {
            var endpoint = API + "MapasRuta/GetAll";
            return $http.get(endpoint);
        };

        //GetAll mapas
        service.getAllConsultas = function () {
            var endpoint = API + "MapasRuta/GetAllConsulta";
            return $http.get(endpoint);
        };

        //GetAll mapas
        service.getAllConsultaPorOC = function (obj) {
            var endpoint = API + "MapasRuta/GetAllConsultaPorOC/"+obj;
            return $http.post(endpoint,obj);
        };

        //Get mapas
        service.getById = function(id) {
            var endpoint = API + "MapasRuta/GetById/" + id;
            return $http.get(endpoint);
        };

        //GetAll Autores
        service.getAutores = function (id) {
            var endpoint = API + "AutoresCP/GetAutoresByContenidoOC/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function(categoria) {
            var endpoint = API + "MapasRuta/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function(categoria) {
            var endpoint = API + "MapasRuta/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function(id) {
            var endpoint = API + "MapasRuta/Delete/" + id;
            return $http.delete(endpoint);
        };

        //DeleteOCWithAutores
        service.DeleteOCWithAutores = function (id) {
            var endpoint = API + "MapasRuta/DeleteOCWithAutores/" + id;
            return $http.delete(endpoint);
        };
        
        //Update Estado MapasRuta
        service.updateEstado = function (campo) {
            var endpoint = API + "MapasRuta/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        
        return service;
    }
})();