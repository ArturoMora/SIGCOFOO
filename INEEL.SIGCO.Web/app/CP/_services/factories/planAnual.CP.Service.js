(function () {
    angular
        .module("ineel.CP.services")
        .factory("PlanesAnualesCPService", [
            "$http",
            "globalGet",
            PlanesAnualesCPService
        ]);


    function PlanesAnualesCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        
        service.GetAllByComunidad = function (idCP) {
            var endpoint = API + "PlanAnual/GetAllByComunidad/"+idCP;
            return $http.get(endpoint);
        };
        //GetAll 
        service.getAll = function () {
            var endpoint = API + "PlanAnual/GetAll";
            return $http.get(endpoint);
        };

        //Get by ID
        service.getById = function (id) {
            var endpoint = API + "PlanAnual/GetById/" + id;
            return $http.get(endpoint);
        };

        //GetAll 
        service.getAllConsultas = function () {
            var endpoint = API + "PlanAnual/GetAllConsulta";
            return $http.get(endpoint);
        };

        //GetAll 
        service.getAllConsultaPorOC = function (obj) {
            var endpoint = API + "PlanAnual/GetAllConsultaPorOC/"+obj;
            return $http.post(endpoint,obj);
        };

        // Get LineasDesarrolloTecnologico
        service.getLineasDesarrolloTecnologico = function () {
            var endpoint = API + "LineaDesarrolloTecnologico/GetAll";
            return $http.get(endpoint);
        };

        //GetAll Autores
        service.getAutores = function (id) {
            var endpoint = API + "AutoresCP/GetAutoresByContenidoOC/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function (categoria) {
            var endpoint = API + "PlanAnual/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function (categoria) {
            var endpoint = API + "PlanAnual/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function (id) {
            var endpoint = API + "PlanAnual/Delete/" + id;
            return $http.delete(endpoint);
        };

        //DeleteOCWithAutores
        service.DeleteOCWithAutores = function (id) {
            var endpoint = API + "PlanAnual/DeleteOCWithAutores/" + id;
            return $http.delete(endpoint);
        };

        //Update Estado PlanAnual
        service.updateEstado = function (campo) {
            var endpoint = API + "PlanAnual/UpdateEstado";
            return $http.put(endpoint, campo);
        }


        return service;
    }
})();