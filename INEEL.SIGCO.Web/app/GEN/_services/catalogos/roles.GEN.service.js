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
        .factory("RolesService", ["$http", "globalGet", RolesService]);

    function RolesService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "Roles/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Roles/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar ambito
        service.Update = function (obj) {
            var endPoint = API + "Roles/Update/" + obj;
            return $http.put(endPoint, obj);
        }
        //Agregar ambito
        service.Add = function (obj) {
            var endPoint = API + "Roles/Create/" + obj;
            return $http.post(endPoint, obj);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Roles/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }


        //Actualizar estado
        service.CreateFuncionesRol = function (Registro) {
            var endPoint = API + "Roles/CreateFuncionesRol/" + Registro;
            return $http.put(endPoint, Registro);
        }



        //Actualizar estado
        service.prueba = function (Registro) {
            var endPoint = API + "Roles/Prueba/" ;
            return $http.put(endPoint);
        }

        return service;

    }

}());