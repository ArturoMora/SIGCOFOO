(function () {
    angular
        .module("ineel.CP.services")
        .factory("AutoresCPService", [
            "$http",
            "globalGet",
            AutoresCPService
        ]);


    function AutoresCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll autores
        service.getAll = function () {
            var endpoint = API + "AutoresCP/GetAll";
            return $http.get(endpoint);
        };

        //Get autores
        service.getById = function (id) {
            var endpoint = API + "AutoresCP/GetById/" + id;
            return $http.get(endpoint);
        }

        //Get autores by contenido de OC
        service.getByContenido = function (objeto) {
            var endpoint = API + "AutoresCP/GetByOC/" + objeto;
            return $http.post(endpoint,objeto);
        }

        //Create
        service.create = function (usuario) {
            var endpoint = API + "AutoresCP/Create/" + usuario;
            return $http.post(endpoint, usuario);
        }

        //Update
        service.update = function (usuario) {
            var endpoint = API + "AutoresCP/Update";
            return $http.put(endpoint, usuario);
        }

        //Delete userbyOc
        service.deleteUserByContenido = function (usuario) {
            var endpoint = API + "AutoresCP/DeleteByContenido";
            return $http.put(endpoint, usuario);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "AutoresCP/Delete/" + id;
            return $http.delete(endpoint);
        }


        return service;
    }
})();