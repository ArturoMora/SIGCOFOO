(function () {
    angular
        .module("ineel.CP.services")
        .factory("TipoDocumentoCPService", [
            "$http",
            "globalGet",
            TipoDocumentoCPService
        ]);


    function TipoDocumentoCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll tipo documento OC
        service.getAll = function () {
            var endpoint = API + "TipoDocumento/GetAllCatalogo";
            return $http.get(endpoint);
        };


        //GetAll tipo documento OC
        service.getPorEstado = function () {
            var endpoint = API + "TipoDocumento/GetByEstado";
            return $http.get(endpoint);
        };

        //Get tipo documento OC
        service.getById = function (id) {
            var endpoint = API + "TipoDocumento/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "TipoDocumento/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "TipoDocumento/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "TipoDocumento/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update estado del tipo de documento
        service.updateEstado = function (campo) {
            var endpoint = API + "TipoDocumento/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        return service;
    }
})();