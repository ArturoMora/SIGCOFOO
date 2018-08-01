(function () {
    angular
        .module("ineel.CP.services")
        .factory("NoticiasCPService", [
            "$http",
            "globalGet",
            NoticiasCPService
        ]);


    function NoticiasCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Noticias/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "Noticias/GetById/" + id;
            return $http.get(endpoint);
        }

        //Get by comunidad
        service.getBycomunidad = function (id) {
            var endpoint = API + "Noticias/GetBycomunidad/" + id;
            return $http.get(endpoint);
        }

        //create
        service.create = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Noticias/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }


        //Update
        service.update = function (categoria) {
            var endpoint = API + "Noticias/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Noticias/Delete/" + id;
            return $http.delete(endpoint);
        }


        return service;
    }
})();