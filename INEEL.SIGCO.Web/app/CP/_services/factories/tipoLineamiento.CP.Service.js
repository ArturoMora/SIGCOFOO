(function () {
    angular
        .module("ineel.CP.services")
        .factory("TipoLineamientoCPService", [
            "$http",
            "globalGet",
            TipoLineamientoCPService
        ]);


    function TipoLineamientoCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll lineamientos
        service.getAll = function () {
            var endpoint = API + "TipoLineamiento/GetAllCatalogo";
            return $http.get(endpoint);
        };

        //Get lineamientos
        service.getById = function (id) {
            var endpoint = API + "TipoLineamiento/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "TipoLineamiento/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "TipoLineamiento/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "TipoLineamiento/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoRoles tipoLineamiento
        service.updateEstado = function (campo) {
            var endpoint = API + "TipoLineamiento/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        return service;
    }
})();