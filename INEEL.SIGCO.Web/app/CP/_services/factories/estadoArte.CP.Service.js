(function () {
    angular
        .module("ineel.CP.services")
        .factory("EstadoArteCPService", [
            "$http",
            "globalGet",
            EstadoArteCPService
        ]);


    function EstadoArteCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll estado arte
        service.getAll = function () {
            var endpoint = API + "EstadoArte/GetAll";
            return $http.get(endpoint);
        };

        //GetAll estado arte (consultas viejas)
        service.getAllConsultas = function () {
            var endpoint = API + "EstadoArte/GetAllConsulta";
            return $http.get(endpoint);
        };


        //GetAll estado arte por consultas
        service.getAllConsultaPorOC = function (obj) {
            var endpoint = API + "EstadoArte/GetAllConsultaPorOC/"+obj;
            return $http.post(endpoint,obj);
        };

        //Get estado arte
        service.getById = function (id) {
            var endpoint = API + "EstadoArte/GetById/" + id;
            return $http.get(endpoint);
        };

        //Get estado arte by comunidad
        service.getByComunidad = function (id) {
            var endpoint = API + "EstadoArte/GetByComunidad/" + id;
            return $http.get(endpoint);
        };

        //GetAll Autores
        service.getAutores = function (id) {
            var endpoint = API + "AutoresCP/GetAutoresByContenidoOC/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function (categoria) {
            var endpoint = API + "EstadoArte/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function (categoria) {
            var endpoint = API + "EstadoArte/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function (id) {
            var endpoint = API + "EstadoArte/Delete/" + id;
            return $http.delete(endpoint);
        };

        //DeleteOCWithAutores
        service.DeleteOCWithAutores = function (id) {
            var endpoint = API + "EstadoArte/DeleteOCWithAutores/" + id;
            return $http.delete(endpoint);
        };

        //Update Estado EstadoArte
        service.updateEstado = function (campo) {
            var endpoint = API + "EstadoArte/UpdateEstado";
            return $http.put(endpoint, campo);
        }


        return service;
    }
})();