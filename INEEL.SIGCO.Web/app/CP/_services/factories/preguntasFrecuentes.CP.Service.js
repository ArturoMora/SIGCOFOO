(function () {
    angular
        .module("ineel.CP.services")
        .factory("PreguntasCPService", [
            "$http",
            "globalGet",
            PreguntasCPService
        ]);


    function PreguntasCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Preguntas/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function(id) {
            var endpoint = API + "Preguntas/GetById/" + id;
            return $http.get(endpoint);
        };

        //Get by comunidad
        service.getByComunidad = function (id) {
            var endpoint = API + "Preguntas/GetByComunidad/" + id;
            return $http.get(endpoint);
        };
        //Get by comunidad
        service.getByComunidad2 = function (id) {
            var endpoint = API + "Preguntas/GetByComunidad2/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function(categoria) {
            var endpoint = API + "Preguntas/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function(categoria) {
            var endpoint = API + "Preguntas/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function(id) {
            var endpoint = API + "Preguntas/Delete/" + id;
            return $http.delete(endpoint);
        };

        
        //Update Estado Preguntas
        //service.updateEstado = function (campo) {
        //    var endpoint = API + "Preguntas/UpdateEstado";
        //    return $http.put(endpoint, campo);
        //}

        
        return service;
    }
})();