(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('NuevoOCService', ['$http', '$q', 'globalGet', NuevoOCService]);

    function NuevoOCService($http, $q, globalGet) {
        var API = globalGet.get("api");
        
        var service = {};

        var _GetAllOfFirstDayOfWeek = function () {
            return $http.get(API + 'NuevoOC/GetAllOfFirstDayOfWeek').then(
                function (response) {
                    return response;
                });
        };
        var _GetTopByMODULO = function (idModulo, top) {
            return $http.get(API + 'NuevoOC/GetTopByMODULO/' + idModulo+'/'+top).then(
                function (response) {
                    return response;
                });
        };
        var _GetAllOfFirstDayOfWeekMODULO = function (idModulo) {
            return $http.get(API + 'NuevoOC/GetAllOfFirstDayOfWeekMODULO/' + idModulo).then(
                function (response) {
                    return response;
                });
        };
        var _GetAll = function () {
            return $http.get(API + 'NuevoOC/GetAll').then(
                function (response) {
                    return response;
                });
        };

        var _GetAllOfDate = function (fecha) {
            return $http.post(API + 'NuevoOC/GetAllOfDate', fecha).then(
                function (response) {
                    return response;
                });
        };
        var _GetCATOcs = function () {
            return $http.get(API + 'NuevoOC/GetCATOcs').then(
                function (response) {
                    return response;
                });
        };
        var _GetAllByEmpleado = function (claveEmpleado) {
            return $http.get(API + 'OCSuscripciones/GetAllByEmpleado/' + claveEmpleado).then(
                function (response) {
                    return response;
                });
        };
        var _UpdateSuscripcion = function (clavePersona,model) {
            return $http.put(API + 'OCSuscripciones/Update/' + clavePersona, model).then(
                function (response) {
                    return response;
                });
        };
        
        service.GetAllOfFirstDayOfWeek = _GetAllOfFirstDayOfWeek;
        service.GetAllOfDate = _GetAllOfDate;
        service.GetAll = _GetAll;
        service.GetAllOfFirstDayOfWeekMODULO = _GetAllOfFirstDayOfWeekMODULO;
        service.GetCATOcs = _GetCATOcs;
        service.GetAllByEmpleado = _GetAllByEmpleado;
        service.UpdateSuscripcion = _UpdateSuscripcion;
        service.GetTopByMODULO = _GetTopByMODULO;
        return service;

    }




})();