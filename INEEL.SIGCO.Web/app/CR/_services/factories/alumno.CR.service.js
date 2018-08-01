(function () {
    "use strict";
    
    angular
        .module("ineel.CR.services")
        .factory("AlumnoCRService", [
        "$http",
        "globalGet",
        AlumnoCRService
        ]);

    function AlumnoCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // GetAll
        service.getAll = function () {
            var endpoint = API + "Alumno/GetAll";
            return $http.get(endpoint);
        };

        // Get 
        service.get = function (AlumnoId) {
            var endpoint = API + "Alumno/GetById/" + AlumnoId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "Alumno/Update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "Alumno/Create/";
            return $http.post(endpoint, model);
        }

        // Delete
        service.delete = function (TipoRelacionId) {
            var endpoint = API + "Alumno/Delete/" + AlumnoId;
            return $http.delete(endpoint);
        }



        return service;

    }

}());