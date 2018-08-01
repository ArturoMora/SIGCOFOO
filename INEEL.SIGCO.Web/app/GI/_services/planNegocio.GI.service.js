(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("planNegocioService", ["$http", "globalGet", planNegocioService]);

    function planNegocioService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.add = function (registro) {
            var endpoint = API + "PlanNegocioEvolutivo/Create";
            return $http.post(endpoint, registro);
        }

        service.getbyclave = function (clave) {
            var endPoint = API + "PlanNegocioEvolutivo/GetAllByEmpleado/" + clave;
            return $http.get(endPoint);
        }
        service.getbyclave2 = function (clave) {
            var endPoint = API + "PlanNegocioEvolutivo/GetAllByEmpleado2/" + clave;
            return $http.get(endPoint);
        }
        service.GetConsultaCartera = function (obj) {
            var endPoint = API + "PlanNegocioEvolutivo/GetConsultaCartera/" + obj;
            return $http.post(endPoint,obj);
        }

        service.GetMisPlanesAnualesConsulta = function (obj) {
            var endPoint = API + "PlanNegocioEvolutivo/GetMisPlanesAnualesConsulta/" + obj;
            return $http.post(endPoint,obj);
        }

        service.getAll = function () {
            var endPoint = API + "PlanNegocioEvolutivo/GetAllCartera";
            return $http.get(endPoint);
        }

        service.getAll2 = function () {
            var endPoint = API + "PlanNegocioEvolutivo/GetAllCartera2";
            return $http.get(endPoint);
        }
        service.getbyid = function (id) {
            var endPoint = API + "PlanNegocioEvolutivo/GetById/" + id;
            return $http.get(endPoint);
        }

        service.GetSolicitud = function (id) {
            var endPoint = API + "PlanNegocioEvolutivo/GetSolicitud/" + id;
            return $http.get(endPoint);
        }

        service.getbyidPropuesta = function (id) {
            var endPoint = API + "PlanNegocioEvolutivo/getbyidPropuesta/" + id;
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "PlanNegocioEvolutivo/Update";
            return $http.put(endpoint, registro);
        }

        service.getDetailsAcceso = function (idReg, claveEmpleado) {
            var endPoint = API + "PlanNegocioEvolutivo/EvidenciaDownload/" + idReg + "/" + claveEmpleado;
            return $http.get(endPoint);
        }

        service.altosmandos = function (idRol) {
            var endPoint = API + "HiperJefes/AltosMandos/" + idRol;
            return $http.get(endPoint);
        }

        service.updateTipoAcceso = function (registro) {
            var endpoint = API + "PlanNegocioEvolutivo/UpdateTipoAcceso";
            return $http.put(endpoint, registro);
        }


        service.updateEstado = function (registro) {
            var endpoint = API + "PlanNegocioEvolutivo/UpdateEstado";
            return $http.put(endpoint, registro);
        }


        service.delete = function (Id) {
            var endPoint = API + "PlanNegocioEvolutivo/Delete/" + Id;
            return $http.delete(endPoint);
        }
      
        return service;

    }

})();