(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("EmpresasCRService", [
            "$http",
            "globalGet",
            "$q",
            EmpresasCRService
        ]);

    function EmpresasCRService($http, globalGet, $q) { //servicios personales llamas a los metodos del WEBApi
        var API = globalGet.get("api");
        var service = {};

        // Get Empresas
        service.getEmpresas = function () {
            var endpoint = API + "Empresas/Get";
            return $http.get(endpoint);
        };
        // Get Empresas para aliados
        service.getEmpresasForAliados = function () {
            var endpoint = API + "Empresas/GetEmpresasForAliados";
            return $http.get(endpoint);
        };
        //Para Modal
        service.getEmpresasModal = function (empresas) {
            var endPoint = API + "Empresas/GetEmpresasModal/";
            return $http.post(endPoint, empresas);
        }
        // Get Empresa
        service.getEmpresa = function (empresaId) {
            var endpoint = API + "Empresas/GetEmpresa/" + empresaId;
            return $http.get(endpoint);
        }
        // Get Empresa
        service.getEmpresaId = function (empresa) {
            var endpoint = API + "Empresas/GetEmpresaConsulta/";
            return $http.post(endpoint, empresa);
        }
        // Get Empresa
        service.getDetailEmpresa = function (empresaId) {
            var endpoint = API + "Empresas/GetEmpresa/" + empresaId;
            return $http.get(endpoint);
        }
        // Create Empresa
        service.create = function (empresa) {
            var endpoint = API + "Empresas/Create/" + empresa;
            return $http.post(endpoint, empresa);
        }
        // Create Empresa
        service.createEmpres = function (empresa) {
            var endpoint = API + "Empresas/CreateEmpres/" + empresa;
            return $http.post(endpoint, empresa);
        }
        // Update Empresa
        service.update = function (empresa) {
            var endpoint = API + "Empresas/Update";
            return $http.put(endpoint, empresa);
        }
        // Delete Contacto
        service.delete = function (empresaId) {
            var endpoint = API + "Empresas/Delete/" + empresaId;
            return $http.delete(endpoint);
        }
        //Actualizar estado para el Eliminado Lógico
        service.updateEstado = function (campo) {
            var endPoint = API + "Empresas/UpdateEstado/";
            return $http.put(endPoint, campo);
        }

        service.getesaliado = function (id) {
            var endPoint = API + "Clientes/GetEsAliado/" + id;
            return $http.get(endPoint);
        }


        ////////////CRUD |claveEmpresa\\\\\\\\\\\\\\\\
        service.createClaveEmpresa = function (claveEmpresa) {
            var endpoint = API + "ClaveEmpresa/Create/" + claveEmpresa;
            return $http.post(endpoint, claveEmpresa);
        }
        service.updateClaveEmpresa = function (claveEmpresa) {
            var endpoint = API + "ClaveEmpresa/Update";
            return $http.put(endpoint, claveEmpresa);
        }
        service.getClavesEmpresas = function () {
            var endpoint = API + "ClaveEmpresa/Get";
            return $http.get(endpoint);
        };
        service.getClaveEmpresa = function (Id) {
            var endpoint = API + "ClaveEmpresa/GetById/" + Id;
            return $http.get(endpoint);
        }
        service.deleteClaveEmpresa = function (claveEmpresa) {
            var endpoint = API + "ClaveEmpresa/Delete";
            return $http.put(endpoint, claveEmpresa);
        };
        return service;
    }
}());
