(function () {
    angular
        .module("ineel.CP.services")
        .factory("ComentariosComunidadCPService", [
            "$http",
            "globalGet",
            ComentariosComunidadCPService
        ]);


    function ComentariosComunidadCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Comentarios/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "Comentarios/GetById/" + id;
            return $http.get(endpoint);
        }

        //Get
        service.getByPost = function (id) {
            var endpoint = API + "Comentarios/GetByPost/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "Comentarios/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "Comentarios/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Comentarios/Delete/" + id;
            return $http.delete(endpoint);
        }

        return service;
    }
})();