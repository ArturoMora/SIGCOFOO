(function () {
    angular
        .module("ineel.CP.services")
        .factory("ListaOcService", [
            "$http",
            "globalGet",
            ListaOcService
        ]);


    function ListaOcService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll lista OC
        service.getAll = function () {
            var endpoint = API + "ListaOC/GetAll";
            return $http.get(endpoint);
        };

        //Get lista OC
        service.getById = function (id) {
            var endpoint = API + "ListaOC/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "ListaOC/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "ListaOC/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "ListaOC/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoCategorias Sitio
        service.updateEstado = function (campo) {
            var endpoint = API + "ListaOC/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        return service;
    }
})();