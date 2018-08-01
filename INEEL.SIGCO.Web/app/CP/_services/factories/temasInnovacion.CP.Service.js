(function () {
    angular
        .module("ineel.CP.services")
        .factory("TemasInnovacionCPService", [
            "$http",
            "globalGet",
            TemasInnovacionCPService
        ]);


    function TemasInnovacionCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        
        service.GetAllByComunidad = function (idCP) {
            var endpoint = API + "TemasInnovacion/GetAllByComunidad/"+idCP;
            return $http.get(endpoint);
        };
        //GetAll 
        service.getAll = function () {
            var endpoint = API + "TemasInnovacion/GetAll";
            return $http.get(endpoint);
        };

        //Get by ID
        service.getById = function (id) {
            var endpoint = API + "TemasInnovacion/GetById/" + id;
            return $http.get(endpoint);
        };

        //GetAll 
        service.getAllConsultas = function () {
            var endpoint = API + "TemasInnovacion/GetAllConsulta";
            return $http.get(endpoint);
        };

        //GetAll  consultas
        service.getAllConsultaPorOC = function (obj) {
            var endpoint = API + "TemasInnovacion/GetAllConsultaPorOC/"+obj;
            return $http.post(endpoint,obj);
        };

        //GetAll Autores
        service.getAutores = function (id) {
            var endpoint = API + "AutoresCP/GetAutoresByContenidoOC/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function (categoria) {
            var endpoint = API + "TemasInnovacion/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function (categoria) {
            var endpoint = API + "TemasInnovacion/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function (id) {
            var endpoint = API + "TemasInnovacion/Delete/" + id;
            return $http.delete(endpoint);
        };

        //DeleteOCWithAutores
        service.DeleteOCWithAutores = function (id) {
            var endpoint = API + "TemasInnovacion/DeleteOCWithAutores/" + id;
            return $http.delete(endpoint);
        };

        //Update Estado TemasInnovacion
        service.updateEstado = function (campo) {
            var endpoint = API + "TemasInnovacion/UpdateEstado";
            return $http.put(endpoint, campo);
        }


        return service;
    }
})();