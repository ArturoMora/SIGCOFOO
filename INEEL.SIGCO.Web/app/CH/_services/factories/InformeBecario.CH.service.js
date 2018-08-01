(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("InformeBecarioCHService", ["$http", "globalGet", InformeBecarioCHService]);

    function InformeBecarioCHService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        //propuesta
        //para el catalogo de tipos de becas para becarios externos
        service.getTipoBecas = function () {
            var endPoint = API + "TipoBeca/GetAll";
            return $http.get(endPoint);
        }

        //Tipos de becas internas
        service.getTiposBecasInternas = function () {
            var endPoint = API + "BecaInterna/GetAll";
            return $http.get(endPoint);
        }

        //para el catalogo de instituciones
        service.getInstituciones = function () {
            var endPoint = API + "Institucion/GetAll";
            return $http.get(endPoint);
        }

        //aplica validaciones especificas para la creacion del becario, las validaciones se adaptaron de sigco2
        service.ValidaRegistroDuplicado = function (obj) {
            var endPoint = API + "BecarioExterno/ValidarDuplicados";
            return $http.post(endPoint, obj);
        }

        //Crea un becario
        service.createBecario = function (obj) {
            var endPoint = API + "BecarioExternoINEEL/create";
            return $http.post(endPoint, obj);
        }

        //obtiene el registro de un becario
        service.getBecario = function (id) {
            var endPoint = API + "BecarioExternoINEEL/GetById/" + id;
            return $http.get(endPoint);
        }

        //actualiza el registro de un becario
        service.updateBecario = function (obj) {
            var endPoint = API + "BecarioExternoINEEL/update";
            return $http.put(endPoint, obj);
        }

        //borra el registro de un becario
        service.deleteBecario = function (id) {
            var endPoint = API + "BecarioExternoINEEL/delete/" + id;
            return $http.delete(endPoint);
        }

        //borra el registro de un becario interno
        service.deleteBecarioInterno = function (id) {
            var endPoint = API + "BecarioInterno/delete/" + id;
            return $http.delete(endPoint);
        }

        //asocia el registro con un becario
        service.ActualizaRegistroBecaEmpleado = function (id, clave) {
            var endPoint = API + "BecarioExternoINEEL/ActualizaRegistroBecaEmpleado/"+id+"/"+clave;
            return $http.put(endPoint);
        }

        return service;

    }

})();