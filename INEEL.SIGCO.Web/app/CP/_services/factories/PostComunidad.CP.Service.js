(function () {
    angular
        .module("ineel.CP.services")
        .factory("PostComunidadCPService", [
            "$http",
            "globalGet",
            PostComunidadCPService
        ]);


    function PostComunidadCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Post/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "Post/GetById/" + id;
            return $http.get(endpoint);
        }

        //Get by comunidad
        service.getByComunidad = function (obj) {
            var endpoint = API + "Post/GetByComunidad/" + obj;
            return $http.post(endpoint,obj);
        }

        //Get by comunidad sin comentarios
        service.getByComunidadSinComentarios = function (obj) {
            var endpoint = API + "Post/GetByComunidadSinComentarios/" + obj;
            return $http.post(endpoint, obj);
        }

        //Get NumTotalPosts
        service.getNumTotalPosts = function (id) {
            var endpoint = API + "Post/GetTotalPostComunidad/"+id;
            return $http.get(endpoint);
        }

        //Get comentarios by post
        service.getComentariosByPost= function (id) {
            var endpoint = API + "Comentarios/GetByPost/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "Post/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "Post/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Post/Delete/" + id;
            return $http.delete(endpoint);
        }

        //crear comentario
        service.createComentario = function (categoria) {
            var endpoint = API + "Comentarios/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        return service;
    }
})();