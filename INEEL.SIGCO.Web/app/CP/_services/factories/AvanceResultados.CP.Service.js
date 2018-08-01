(function () {
    angular
        .module("ineel.CP.services")
        .factory("AvanceResultadosCPService", [
            "$http",
            "globalGet",
            AvanceResultadosCPService
        ]);


    function AvanceResultadosCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Avances/GetAll";
            return $http.get(endpoint);
        };

        //Get
        service.getById = function(id) {
            var endpoint = API + "Avances/GetById/" + id;
            return $http.get(endpoint);
        };

        
        
        //create
        service.create = function(Registro) {
            var request = $http({
                method: "post",
                url: API + "Avances/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        };


        //Update
        service.update = function(categoria) {
            var endpoint = API + "Avances/Update";
            return $http.put(endpoint, categoria);
        };

        //Delete
        service.delete = function(id) {
            var endpoint = API + "Avances/Delete/" + id;
            return $http.delete(endpoint);
        };

        //GetCompromisos
        service.getAllCompromisos = function (id) {
            var endpoint = API + "Metas/GetByComunidad/" + id;
            return $http.get(endpoint);
        };

        //GetCompromisos With resultados
        service.getCompromisosWithResultados = function (id) {
            var endpoint = API + "Metas/GetWithResultadosByComunidad/" + id;
            return $http.get(endpoint);
        };

        //Create avance resultados por miembro
        service.createAvanceMiembros = function (obj) {
            var endpoint = API + "AvanceMiembros/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Get avances by comunidad
        service.getByComunidad = function (id) {
            var endpoint = API + "Avances/GetByComunidad/" + id; 
            return $http.get(endpoint);
        };

        //get participacion miembros by avance
        service.getMiembrosByAvance = function (id) {
            var endpoint = API + "AvanceMiembros/GetByAvance/" + id;
            return $http.get(endpoint);
        };

        return service;
    }
})();