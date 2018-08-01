/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
FooEntitiesService nombre de factory en ENTITIES.service.js
"iie.services".- referencia a /app/_services/*.service.js
*/ 
(function () {
    "use strict";
    
    angular
        .module("ineel.GEN.services")
        .factory("tipopersonaService", ["$http", "globalGet", tipopersonaService]);

    function tipopersonaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "TipoPersonal/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.GetById = function (id) {
            var endPoint = API + "TipoPersonal/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (obj) {
            var endPoint = API + "TipoPersonal/Update/" + obj;
            return $http.put(endPoint, obj);
        }
        //Agregar ambito
        service.Add = function (obj) {
            var endPoint = API + "TipoPersonal/Create/" + obj;
            return $http.post(endPoint, obj);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "TipoPersonal/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        return service;

    }

}());