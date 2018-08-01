(function () {
    angular
        .module("ineel.CP.services")
        .factory("MetasComunidadesCPService", [
            "$http",
            "globalGet",
            MetasComunidadesCPService
        ]);


    function MetasComunidadesCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Metas/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "Metas/Get/" + id;
            return $http.get(endpoint);
        }

        service.create = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Metas/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "Metas/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Metas/Delete/" + id;
            return $http.delete(endpoint);
        }

        //GetCompromisos
        service.getAllCompromisos = function (id) {
            var endpoint = API + "Metas/GetByComunidad/"+id;
            return $http.get(endpoint);
        };

        //GetCompromisosWithResultados
        service.getCompromisosWithResultados = function (id) {
            var endpoint = API + "Metas/GetWithResultadosByComunidad/" + id;
            return $http.get(endpoint);
        };

        return service;
    }
})();