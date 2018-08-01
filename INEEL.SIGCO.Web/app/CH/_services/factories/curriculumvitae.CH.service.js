(function () {
    "use strict";
    var app = angular.module("ineel.CH.services");

    app.factory("CurriculumVitaeCHService", ["$http", "globalGet", CurriculumVitaeCHService]);

    function CurriculumVitaeCHService($http, globalGet) {
        ////Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        service.GetAllInformacion = function (id) {
            var endpoint = API + "CurriculumVitae/GetByClave/" + id;
            return $http.get(endpoint);
        }

        service.GetAllUsersGerente = function (id) {
            var endpoint = API + "Personas/GetUsersByClaveUnidad/" + id;
            return $http.get(endpoint);
        }

        service.GetAllUsersDivicion = function (id) {
            var endpoint = API + "UnidadOrganizacional/GetAllDivicion/" + id;
            return $http.get(endpoint);
        }

        service.GetAllUsersEjecutivo = function () {
            var endpoint = API + "Personas/GetAllUsersEjecutivo";
            return $http.get(endpoint);
        }


        return service;
    }
})();