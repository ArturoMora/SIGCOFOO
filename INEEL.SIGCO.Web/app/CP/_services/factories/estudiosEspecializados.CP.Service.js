(function () {
    angular
        .module("ineel.CP.services")
        .factory("EstudiosEspecializadosCPService", [
            "$http",
            "globalGet",
            EstudiosEspecializadosCPService
        ]);


    function EstudiosEspecializadosCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll estudios 
        service.getAll = function () {
            var endpoint = API + "EstudiosEspecializados/GetAll";
            return $http.get(endpoint);
        };

        //Carga los estudios creados en X comunidad
        service.GetAllByComunidad = function (idCP) {
            var endpoint = API + "EstudiosEspecializados/GetAllByComunidad/"+idCP;
            return $http.get(endpoint);
        };
        
        //Get estudios 
        service.getById = function (id) {
            var endpoint = API + "EstudiosEspecializados/GetById/" + id;
            return $http.get(endpoint);
        };


        //GetAll estudios consulta
        service.getAllConsultas = function () {
            var endpoint = API + "EstudiosEspecializados/GetAllConsulta";
            return $http.get(endpoint);
        };

        //GetAll estudios consulta
        service.getAllConsultaPorOC = function (obj) {
            var endpoint = API + "EstudiosEspecializados/getAllConsultaPorOC/"+obj;
            return $http.post(endpoint,obj);
        };

        //GetAll Autores
        service.getAutores = function (id) {
            var endpoint = API + "AutoresCP/GetAutoresByContenidoOC/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function (categoria) {
            var endpoint = API + "EstudiosEspecializados/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function (categoria) {
            var endpoint = API + "EstudiosEspecializados/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function (id) {
            var endpoint = API + "EstudiosEspecializados/Delete/" + id;
            return $http.delete(endpoint);
        };

        //DeleteOCWithAutores
        service.DeleteOCWithAutores = function (id) {
            var endpoint = API + "EstudiosEspecializados/DeleteOCWithAutores/" + id;
            return $http.delete(endpoint);
        };

        //Update Estado EstudiosEspecializados
        service.updateEstado = function (campo) {
            var endpoint = API + "EstudiosEspecializados/UpdateEstado";
            return $http.put(endpoint, campo);
        }


        return service;
    }
})();