(function () {
    angular
        .module("ineel.CP.services")
        .factory("SitiosInteresCPService", [
            "$http",
            "globalGet",
            SitiosInteresCPService
        ]);


    function SitiosInteresCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "SitioInteres/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function(id) {
            var endpoint = API + "SitioInteres/GetById/" + id;
            return $http.get(endpoint);
        };

        //Get
        service.getByComunidad = function (id) {
            var endpoint = API + "SitioInteres/GetByComunidad/" + id;
            return $http.get(endpoint);
        };

        //Create
        service.create = function(categoria) {
            var endpoint = API + "SitioInteres/Create/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function(categoria) {
            var endpoint = API + "SitioInteres/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function(id) {
            var endpoint = API + "SitioInteres/Delete/" + id;
            return $http.delete(endpoint);
        };

        
        //Get categorias sitio interes
        service.getCategoriasSitio = function () {
            var endpoint = API + "CategoriaSitio/GetAll";
            return $http.get(endpoint);
        };

        
        return service;
    }
})();