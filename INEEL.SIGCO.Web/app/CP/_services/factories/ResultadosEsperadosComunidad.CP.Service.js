(function () {
    angular
        .module("ineel.CP.services")
        .factory("ResultadosEsperadosComunidadCPService", [
            "$http",
            "globalGet",
            ResultadosEsperadosComunidadCPService
        ]);


    function ResultadosEsperadosComunidadCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "ResultadosMetas/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "ResultadosMetas/GetById/" + id;
            return $http.get(endpoint);
        }

        //Get by comunidad
        service.getBycomunidad = function (id) {
            var endpoint = API + "ResultadosMetas/GetByComunidad/" + id;
            return $http.get(endpoint);
        }

        //Get by meta
        service.GetByMeta = function (id) {
            var endpoint = API + "ResultadosMetas/GetByMeta/" + id;
            return $http.get(endpoint);
        }

        //create
        service.create = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "ResultadosMetas/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }


        //Update
        service.update = function (categoria) {
            var endpoint = API + "ResultadosMetas/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "ResultadosMetas/Delete/" + id;
            return $http.delete(endpoint);
        }

        //GetCompromisos
        service.getAllCompromisos = function (id) {
            var endpoint = API + "Metas/GetByComunidad/" + id;
            return $http.get(endpoint);
        };

        return service;
    }
})();