(function () {
    angular
        .module("ineel.CP.services")
        .factory("InformesAnualesCPService", [
            "$http",
            "globalGet",
            InformesAnualesCPService
        ]);


    function InformesAnualesCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        
        
        service.GetAllByComunidad = function (idCP) {
            var endpoint = API + "InformeAnual/GetAllByComunidad/"+idCP;
            return $http.get(endpoint);
        };
        //GetAll 
        service.getAll = function () {
            var endpoint = API + "InformeAnual/GetAll";
            return $http.get(endpoint);
        };

        //Get by ID
        service.getById = function (id) {
            var endpoint = API + "InformeAnual/GetById/" + id;
            return $http.get(endpoint);
        };

        // Get LineasDesarrolloTecnologico
        service.getLineasDesarrolloTecnologico = function () {
            var endpoint = API + "LineaDesarrolloTecnologico/GetAll";
            return $http.get(endpoint);
        };

        //GetAll 
        service.getAllConsultas = function () {
            var endpoint = API + "InformeAnual/GetAllConsulta";
            return $http.get(endpoint);
        };

        //GetAll 
        service.getAllConsultaPorOC = function (obj) {
            var endpoint = API + "InformeAnual/GetAllConsultaPorOC/"+obj;
            return $http.post(endpoint,obj);
        };

        //GetAll Autores
        service.getAutores = function (id) {
            var endpoint = API + "AutoresCP/GetAutoresByContenidoOC/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function (categoria) {
            var endpoint = API + "InformeAnual/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function (categoria) {
            var endpoint = API + "InformeAnual/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function (id) {
            var endpoint = API + "InformeAnual/Delete/" + id;
            return $http.delete(endpoint);
        };

        //DeleteOCWithAutores
        service.DeleteOCWithAutores = function (id) {
            var endpoint = API + "InformeAnual/DeleteOCWithAutores/" + id;
            return $http.delete(endpoint);
        };

        //Update Estado InformeAnual
        service.updateEstado = function (campo) {
            var endpoint = API + "InformeAnual/UpdateEstado";
            return $http.put(endpoint, campo);
        }


        return service;
    }
})();