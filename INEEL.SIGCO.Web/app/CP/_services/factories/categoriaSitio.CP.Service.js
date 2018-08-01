(function () {
    angular
        .module("ineel.CP.services")
        .factory("CategoriaSitioService", [
            "$http",
            "globalGet",
            CategoriaSitioService
        ]);


    function CategoriaSitioService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll Categorias Sitio
        service.getAll = function () {
            var endpoint = API + "CategoriaSitio/GetAllCatalogo";
            return $http.get(endpoint);
        };

        //Get Categorias
        service.getById = function (id) {
            var endpoint = API + "CategoriaSitio/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "CategoriaSitio/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "CategoriaSitio/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "CategoriaSitio/Delete" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoCategorias Sitio
        service.updateEstado = function (campo) {
            var endpoint = API + "CategoriaSitio/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        return service;
    }
})();