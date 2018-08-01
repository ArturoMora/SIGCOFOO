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
        .factory("plazaService", ["$http", "globalGet", plazaService]);

    function plazaService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "Plaza/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Plaza/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (obj) {
            var endPoint = API + "Plaza/Update/" + obj;
            return $http.put(endPoint, obj);
        }
        //Agregar ambito
        service.Add = function (obj) {
            var endPoint = API + "Plaza/Create/" + obj;
            return $http.post(endPoint, obj);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Plaza/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }


        return service;

    }

}());