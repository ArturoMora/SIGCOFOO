(function() {
    angular
        .module("ineel.CP.services")
        .factory("CategoriaCPService", [
            "$http",
            "globalGet",
            CategoriaCPService
        ]);


    function CategoriaCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll CategoriasCP
        service.getAllCategorias = function() {
            var endpoint = API + "CategoriaCP/GetAllCatalogo";
            return $http.get(endpoint);
        };


        //GetAll CategoriasCP
        service.getAllCategoriasActivas = function () {
            var endpoint = API + "CategoriaCP/GetAllActivas";
            return $http.get(endpoint);
        };

        //Get CategoriasCP byID
        service.getCategoria=function(id) {
            var endpoint = API + "CategoriaCP/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create CategoriasCP
        service.create=function(categoria) {
            var endpoint = API + "CategoriaCP/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update CategoriaCP
        service.update=function(categoria) {
            var endpoint = API + "CategoriaCP/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete CategoriaCP
        service.delete=function(id) {
            var endpoint = API + "CategoriaCP/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoCategoriaCP
        service.updateEstado=function(campo) {
            var endpoint = API + "CategoriaCP/UpdateEstado";
            return $http.put(endpoint,campo);
        }



        return service;
    }
})();