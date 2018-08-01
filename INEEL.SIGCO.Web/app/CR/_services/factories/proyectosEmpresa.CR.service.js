(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ProyectosEmpresaCRService", [
            "$http",
            "globalGet",
            ProyectosEmpresaCRService
        ]);

    function ProyectosEmpresaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get ProyectosTecnicos
        // No considera los administrativos
        service.getProyectosTecnicos = function () {
            var endpoint = API + "ProyectosEmpresa/GetAllTecnicos";
            return $http.get(endpoint);
        };

        service.getProyectosTecnicosServerSide = function () {
            var endpoint = API + "ProyectosEmpresa/GetAllTecnicosServerSide";
            return $http.post(endpoint);
        };

        // Get Proyectos
        service.getProyectosEmpresa = function () {
            var endpoint = API + "ProyectosEmpresa/GetAll";
            return $http.get(endpoint);
        };
        // Get Proyecto
        service.getProyectoEmpresa = function (proyectoId) {
            var endpoint = API + "ProyectosEmpresa/Get/" + proyectoId;
            return $http.get(endpoint);
        };
        // Get Proyecto
        service.getProyectoEmpresaAsignado = function (proyectoId) {
            var endpoint = API + "ProyectosEmpresa/GetAsignado/" + proyectoId;
            return $http.get(endpoint);
        };
        // Get Proyectos Asignados
        service.getProyectosAsignadosEmpresa = function (empresaId) {
            var endpoint = API + "ProyectosEmpresa/GetAllProyectosAsociados/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Proyectos Asignados
        service.GetProyectosAsociadosUnidadesEmpresas = function (empresaId) {
            var endpoint = API + "ProyectosEmpresa/GetProyectosAsociadosUnidadesEmpresas/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Proyectos Asignados no vigentes
        service.GetProyectosAsociadosInactivosUnidadesEmpresas = function (empresaId) {
            var endpoint = API + "ProyectosEmpresa/GetProyectosAsociadosInactivosUnidadesEmpresas/" + empresaId;
            return $http.get(endpoint);
        };

        // Get Proyectos Asignados no vigentes
        service.GetProyectosAsociadosInactivosNodoEmpresas = function (nodo) {
            var endpoint = API + "ProyectosEmpresa/GetProyectosAsociadosInactivosNodoEmpresas/";
            return $http.post(endpoint, nodo);
        };

        //Get Proyectos Asociados Vigentes con una Empresa
        service.getProyectosAsociadosVigentes = function (empresaId) {
            var endpoint = API + "ProyectosEmpresa/GetProyectosAsociadosVigentes/" + empresaId;
            return $http.get(endpoint);
        };

        //Get Proyectos Asociados Vigentes con una unidad de la Empresa
        service.GetProyectosAsociadosVigentesUnidadesEmpresas = function (empresaId) {
            var endpoint = API + "ProyectosEmpresa/GetProyectosAsociadosVigentesUnidadesEmpresas/" + empresaId;
            return $http.get(endpoint);
        };

        //Get Proyectos Asociados Vigentes con una unidad de la Empresa
        service.GetProyectosAsociadosVigentesNodoEmpresas = function (nodo) {
            var endpoint = API + "ProyectosEmpresa/GetProyectosAsociadosVigentesNodoEmpresas/";
            return $http.post(endpoint, nodo);
        };

        //Get informacion de la unidad organizacional de x empresa (no soporta los casos de unidades que tengan puntos en su nombre, como CFE1.6)
        service.GetInformacionUnidadEmpresa = function (empresaId) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/GetInformacionUnidadEmpresa/" + empresaId;
            return $http.get(endpoint);
        };

        //Get informacion de la unidad organizacional de x empresa (adaptado para los casos de unidades que tengan puntos en su nombre, como CFE1.6)
        service.GetInformacionNodoEmpresa = function (nodo) {
            var endpoint = API + "UnidadOrganizacionalEmpresas/GetInformacionNodoEmpresa/";
            return $http.post(endpoint, nodo);
        };

        // Asociar proyecto
        service.updateEmpresa = function (proyectoEmpresa) {
            var endpoint = API + "ProyectosEmpresa/Create";
            return $http.put(endpoint, proyectoEmpresa);
        };
        // Update Proyecto
        service.update = function (proyectoEmpresa) {
            var endpoint = API + "ProyectosEmpresa/Update";
            return $http.put(endpoint, proyectoEmpresa);
        }
        // Delete Proyecto
        service.delete = function (proyectoEmpresa) {
            var endpoint = API + "ProyectosEmpresa/Delete";
            return $http.put(endpoint, proyectoEmpresa);
        }
        return service;
    }
}());