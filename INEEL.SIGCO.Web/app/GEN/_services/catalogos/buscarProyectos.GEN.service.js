
(function () {
    "use strict";
    
    angular
        .module("ineel.GEN.services")
        .factory("buscarProyectosService", ["$http", "globalGet", buscarProyectosService]);

    function buscarProyectosService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "Proyectos/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Proyectos/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (obj) {
            var endPoint = API + "Proyectos/Update/" + obj;
            return $http.put(endPoint, obj);
        }
        //Agregar ambito
        service.Add = function (obj) {
            var endPoint = API + "Proyectos/Create/" + obj;
            return $http.post(endPoint, obj);
        }

        service.GetProyectos = function (proyecto) {
            var endPoint = API + "Proyectos/GetProyectos/";
            return $http.post(endPoint, proyecto);
        }

        return service;


    }

}());