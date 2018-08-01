
(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .factory("ResponsablesModulosService", ["$http", "globalGet", FuncionesRolService]);

    function FuncionesRolService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GetByRol = function () {
            var endPoint = API + "RolPersona/GetAll";
            return $http.get(endPoint);
        }

        service.GetByClave = function (clave) {
            var endPoint = API + "personas/GetByIdFichaPersonal/" + clave;
            return $http.get(endPoint);

        }

        return service;


    }

}());