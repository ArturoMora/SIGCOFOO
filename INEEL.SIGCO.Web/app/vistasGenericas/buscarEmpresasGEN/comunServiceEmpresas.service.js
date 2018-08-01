(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('ComunServiceEmpresas', ['$http', '$q', 'globalGet', ComunServiceEmpresas]);

    function ComunServiceEmpresas($http, $q, globalGet) {
        var API = globalGet.get("api");

        var service = {};

        // Obtener DA by Id
        service.getDatosEmpresa = function (id) {
            var endpoint = API + "Empresas/GetDatosForModalEmpresa/" + id;
            return $http.get(endpoint);
        };

        service.GetEmpresaWithImagen = function (id) {
            var endPoint = API + "Empresas/GetEmpresaWithImagen/" + id;
            return $http.get(endPoint);
        }

        service.CountProyectosHistoricos = function (id) {
            var endPoint = API + "ProyectosEmpresa/CountProyectosHistoricos/" + id;
            return $http.get(endPoint);
        }

        service.CountProyectosVigentes = function (id) {
            var endPoint = API + "ProyectosEmpresa/CountProyectosVigentes/" + id;
            return $http.get(endPoint);
        }

        service.CountConveniosEmpresa = function (id) {
            var endPoint = API + "Aliado/CountConveniosEmpresa/" + id;
            return $http.get(endPoint);
        }

        service.CountFondosByEmpresa = function (id) {
            var endPoint = API + "FondosPrograma/CountFondosByEmpresa/" + id;
            return $http.get(endPoint);
        }

        service.GetProyectosVigentesEmpresa = function (id) {
            var endPoint = API + "ProyectosEmpresa/GetProyectosVigentesEmpresa/" + id;
            return $http.get(endPoint);
        }

        service.GetProyectosNoVigentes = function (id) {
            var endPoint = API + "ProyectosEmpresa/GetProyectosNoVigentes/" + id;
            return $http.get(endPoint);
        }
 
        service.getPropuestasAsignadasEmpresa = function (empresaId) {
            var endpoint = API + "Propuestas/GetAllPropuestasAsociadas/" + empresaId;
            return $http.get(endpoint);
        };

        service.getIniciativasAsignadasEmpresa = function (empresaId) {
            var endpoint = API + "Iniciativas/GetAllIniciativasAsociadas/" + empresaId;
            return $http.get(endpoint);
        };

        service.getOportunidadesAsignadasEmpresa = function (Id) {
            var endpoint = API + "OportunidadNegocio/GetAllOportunidadesAsociadas/" + Id;
            return $http.get(endpoint);
        };

        service.GetConveniosVigentesByEmpresa = function (Id) {
            var endpoint = API + "Convenio/GetConveniosVigentesByEmpresa/" + Id;
            return $http.get(endpoint);
        };

        service.GetConveniosNoVigentesByEmpresa = function (Id) {
            var endpoint = API + "Convenio/GetConveniosNoVigentesByEmpresa/" + Id;
            return $http.get(endpoint);
        };

        service.GetProductosByEmpresa = function (Id) {
            var endpoint = API + "Producto/GetProductosByEmpresa/" + Id;
            return $http.get(endpoint);
        };

        service.GetServiciosByEmpresa = function (Id) {
            var endpoint = API + "Servicio/GetServiciosByEmpresa/" + Id;
            return $http.get(endpoint);
        };

        service.GetFondosByEmpresa = function (Id) {
            var endpoint = API + "FondosPrograma/GetFondosByEmpresa/" + Id;
            return $http.get(endpoint);
        };

        return service;
    }

    //foo


})();