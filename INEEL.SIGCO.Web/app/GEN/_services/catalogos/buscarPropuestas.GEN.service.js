
(function () {
    "use strict";
    
    angular
        .module("ineel.GEN.services")
        .factory("buscarPropuestasService", ["$http", "globalGet", buscarPropustasService]);

    function buscarPropuestasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "Propuestas/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Propuestas/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (obj) {
            var endPoint = API + "Propuestas/Update/" + obj;
            return $http.put(endPoint, obj);
        }
        //Agregar ambito
        service.Add = function (obj) {
            var endPoint = API + "Propuestas/Create/" + obj;
            return $http.post(endPoint, obj);
        }

        service.GetPropuestas = function (propuesta) {
            debugger;
            var endPoint = API + "Propuestas/GetPropuestas/";
            return $http.post(endPoint, propuesta);
        }

        return service;


    }

}());