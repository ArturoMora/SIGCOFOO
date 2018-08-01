(function () {
    angular
        .module("ineel.CP.services")
        .factory("LineamientosCPService", [
            "$http",
            "globalGet",
            LineamientosCPService
        ]);


    function LineamientosCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Lineamientos/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "Lineamientos/GetById/" + id;
            return $http.get(endpoint);
        }

        //create
        service.create = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Lineamientos/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }

        //Create
        service.createLineamiento = function (categoria) {
            var endpoint = API + "Lineamientos/CreateLineamiento/" + categoria;
            return $http.post(endpoint, categoria);
        };

        //Update
        service.update = function (categoria) {
            var endpoint = API + "Lineamientos/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Lineamientos/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Comentarios por comunidad
        service.GetByLineamiento = function (id) {
            var endpoint = API + "ComentariosLCP/GetByLineamiento/" + id;
            return $http.get(endpoint);
        }

        //Crear comentario de lineamiento
        service.createComentario = function (objeto) {
            var endpoint = API + "ComentariosLCP/Create/" + objeto;
            return $http.post(endpoint, objeto);
        };

        return service;
    }
})();