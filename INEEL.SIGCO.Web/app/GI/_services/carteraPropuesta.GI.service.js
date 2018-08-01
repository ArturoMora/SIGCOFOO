(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("carteraPropuestaService", ["$http", "globalGet", carteraPropuestaService]);

    function carteraPropuestaService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        
        service.GetAllCartera = function () {
            var endPoint = API + "Propuesta/GetAllCartera";
            return $http.get(endPoint);
        }
        service.GetAllCarterabyEmpleado = function (claveEmpleado) {
            var endPoint = API + "Propuesta/GetAllCarterabyEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }

        //Consulta parametrizada de propuestas de innovacion
        service.GetConsultaCartera = function (obj) {
            var endPoint = API + "Propuesta/GetConsultaCartera/" + obj;
            return $http.post(endPoint,obj);
        }

        //obtiene los segmentos de mercado en cr
        service.GetSegmentosMercado = function () {
            var endPoint = API + "Propuesta/GetSegmentosMercado";
            return $http.get(endPoint);
        }
        
        service.getAll = function () {
            var endPoint = API + "Propuesta/GetAll";
            return $http.get(endPoint);
        }

        service.getPropuestaConIdeaById = function (id) {
            var endPoint = API + "Propuesta/GetById/" + id;
            return $http.get(endPoint);
        }

        service.getPropuestaConIdeaByIdIdentity = function (id) {
            var endPoint = API + "Propuesta/GetByIdIdentity/" + id;
            return $http.get(endPoint);
        }

        service.deletePlanNegocio = function (Id) {
            var endPoint = API + "PlanNegocioEvolutivo/Delete/" + Id;
            return $http.delete(endPoint);
        }
        
        service.DeletePropuestaConPlan = function (Id) {
            var endPoint = API + "Propuesta/DeletePropuestaConPlan/" + Id;
            return $http.delete(endPoint);
        }

        service.add = function (registro) {
            var endpoint = API + "Propuesta/Create";
            return $http.post(endpoint, registro);
        }

        service.getUnidadOrganizacional = function (id) {
            var endPoint = API + "UnidadOrganizacional/GetById/" + id;
            return $http.get(endPoint,id);
        }

        service.delete = function (Id) {
            debugger;
            var endPoint = API + "Propuesta/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "Propuesta/Update";
            return $http.put(endpoint, registro);
        }

        service.updateEstado = function (registro) {
            var endpoint = API + "Propuesta/UpdateEstado";
            return $http.put(endpoint, registro);
        }

        service.getAllSegmentoMercado = function () {
            var endPoint = API + "SegmentoMercado/GetAll";
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.getDetailsAcceso = function (idReg, claveEmpleado) {
            var endPoint = API + "Propuesta/EvidenciaDownload/" + idReg+"/"+claveEmpleado;
            return $http.get(endPoint);
        }
        return service;

    }

})();