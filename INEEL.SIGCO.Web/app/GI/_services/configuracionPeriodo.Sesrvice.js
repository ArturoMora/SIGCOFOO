(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("configuracionPeriodoService", ["$http", "globalGet", configuracionPeriodoService]);

    function configuracionPeriodoService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "PeriodoFI/GetAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "PeriodoFI/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar
        service.Update = function (registro) {
            var endPoint = API + "PeriodoFI/Update";
            return $http.put(endPoint, registro);
        }

        //Agregar ambito
        service.add = function (registro) {
            var endPoint = API + "PeriodoFI/Create";
            return $http.post(endPoint, registro);
        }

        //Actualizar estado
        service.UpdateEstado = function (registro) {
            var endPoint = API + "PeriodoFI/UpdateEstado/";
            return $http.put(endPoint, registro);
        }

        service.getExistActivo = function () {
            var endPoint = API + "PeriodoFI/ExisteActivo";
            return $http.get(endPoint);
        }

        service.delete = function (Id) {
            debugger;
            var endPoint = API + "PeriodoFI/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.GetByIdPeriodoFI = function (id) {
            var endPoint = API + "PeriodoRecepcion/GetByIdPeriodoFI/" + id;
            return $http.get(endPoint);
        }
        service.GetReplicaByIdPeriodoFI = function (id) {
            var endPoint = API + "PeriodoReplica/GetByIdPeriodoFI/" + id;
            return $http.get(endPoint);
        }
        service.UpdatePeriodoSeleccion = function (registro) {
            var endPoint = API + "PeriodoRecepcion/Update";
            return $http.put(endPoint, registro);
        }

        service.UpdatePeriodoReplica = function (registro) {
            var endPoint = API + "PeriodoReplica/Update";
            return $http.put(endPoint, registro);
        }
        
        return service;
    }
})();