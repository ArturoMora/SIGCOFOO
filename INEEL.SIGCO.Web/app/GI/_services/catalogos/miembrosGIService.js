(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("MiembrosGIService", ["$http", "globalGet", MiembrosGIService]);

    function MiembrosGIService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        service.getMiembrosActivosByGrupo = function (id) {
            var endPoint = API + "MiembrosGI/GetActivosByGrupo/" + id;
            return $http.get(endPoint);
        }

        service.getMiembrosInactivosByGrupo = function (id) {
            var endPoint = API + "MiembrosGI/GetInactivosByGrupo/" + id;
            return $http.get(endPoint);
        }


        service.addMiembro = function (registro) {
            var endpoint = API + "MiembrosGI/Create";
            return $http.post(endpoint, registro);
        }

        service.updateMiembro = function (registro) {
            var endpoint = API + "MiembrosGI/Update";
            return $http.put(endpoint, registro);
        }

        service.ActivaMiembro = function (registro) {
            var endpoint = API + "MiembrosGI/ActivaMiembro";
            return $http.put(endpoint, registro);
        }

        service.InactivaMiembro = function (registro) {
            var endpoint = API + "MiembrosGI/InactivaMiembro";
            return $http.put(endpoint, registro);
        }

        service.deleteMiembro = function (Id) {
            var endPoint = API + "MiembrosGI/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.DeleteWithRol = function (Id) {
            var endPoint = API + "MiembrosGI/DeleteWithRol/" + Id;
            return $http.delete(endPoint);
        }

        service.getGrupoEvaluadores = function () {
            var endPoint = API + "Comite/GetAll";
            return $http.get(endPoint);
        }

        return service;

    }

})();